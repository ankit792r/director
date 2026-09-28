package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"
	"time"

	webview "github.com/abemedia/go-webview"
	_ "github.com/abemedia/go-webview/embedded"
)

func OpenUI() error {
	w := webview.New(true)
	defer w.Destroy()

	w.SetTitle("Director")
	w.SetSize(1200, 800, webview.HintNone)

	// Webview -> GO
	err := w.Bind("hostInvoke", func(method string, params any) any {
		fmt.Println("hostInvoke", method, params)
		return "pong"
	})

	if err != nil {
		log.Fatal(err)
	}

	url := "http://localhost:5173"
	if os.Getenv("APP_DEV") != "1" {
		addr, err := loadStaticUI()
		if err != nil {
			return err
		}
		url = "http://" + addr
	}

	// temp thread to emit event GO -> Webview
	go func() {
		var count = 0
		for {
			if count == 10 {
				break
			} else {
				count++
			}

			fmt.Println("count is: ", count)

			time.Sleep(2 * time.Second)
			w.Dispatch(func() {
				w.Eval(fmt.Sprintf(
					`window.hostEvent("%s", "%s")`,
					"count",
					strconv.Itoa(count),
				))
			})
		}
	}()

	w.Navigate(url)
	w.Run()

	return nil
}

//go:embed dist
var uiOutput embed.FS

func loadStaticUI() (string, error) {
	dist, err := fs.Sub(uiOutput, "dist")
	if err != nil {
		return "", err
	}

	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return "", err
	}

	addr := listener.Addr().String()

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestPath := strings.TrimPrefix(
			path.Clean(r.URL.Path),
			"/",
		)

		if requestPath == "" || requestPath == "." {
			requestPath = "index.html"
		}

		if _, err := fs.Stat(dist, requestPath); err == nil {
			http.FileServer(http.FS(dist)).ServeHTTP(w, r)
			return
		}

		index, err := fs.ReadFile(dist, "index.html")
		if err != nil {
			http.Error(
				w,
				"index.html not found",
				http.StatusInternalServerError,
			)
			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(index)
	})

	server := &http.Server{
		Handler: handler,
	}

	go func() {
		if err := server.Serve(listener); err != nil &&
			err != http.ErrServerClosed {
			fmt.Fprintln(os.Stderr, err)
		}
	}()

	return addr, nil
}
