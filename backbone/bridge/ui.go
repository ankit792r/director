package bridge

import (
	"encoding/json"

	"github.com/abemedia/go-webview"
)

// RegisterUI registers window lifecycle RPC methods.
func RegisterUI(b *Bridge, w webview.WebView) {
	b.Register("quit", func(_ json.RawMessage) (any, error) {
		go w.Terminate()
		return map[string]bool{"ok": true}, nil
	})
}
