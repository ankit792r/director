package webview

import (
	"log"

	"director/backbone/bridge"

	"github.com/abemedia/go-webview"
)

func attachBridge(w webview.WebView) {
	b := bridge.New(w)
	bridge.RegisterCore(b)
	bridge.RegisterFS(b)
	if err := b.Attach(); err != nil {
		log.Fatalf("Failed to attach UI bridge: %v", err)
	}
}
