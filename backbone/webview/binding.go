package webview

import (
	"director/backbone/bridge"
	"log"

	"github.com/abemedia/go-webview"
)

func attachBridge(w webview.WebView) {
	b := bridge.New(w)
	bridge.RegisterDefault(b)

	// Here we will register other handlers

	if err := b.Attach(); err != nil {
		log.Fatalf("Failed to attach UI bridge: %v", err)
	}
}
