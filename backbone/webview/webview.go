package webview

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/abemedia/go-webview"
	_ "github.com/abemedia/go-webview/embedded"
)

func OpenUi() {
	w := webview.New(false)
	defer w.Destroy()

	w.SetTitle("Director")
	w.SetSize(1200, 800, webview.HintNone)

	url := "http://localhost:5173"
	if os.Getenv("DIRECTOR_DEV") != "1" {
		addr, err := loadUi()
		if err != nil {
			log.Fatalf("Failed to load static UI: %v", err)
		}
		url = "http://" + addr
	}

	w.Navigate(url)
	w.Run()
}

//go:embed output
var uiOutput embed.FS

func loadUi() (string, error) {
	dist, err := fs.Sub(uiOutput, "output")
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
