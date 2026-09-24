package bridge

import (
	"encoding/json"
	"fmt"
	"sync"

	"github.com/abemedia/go-webview"
)

// Handler handles a JSON payload from the UI and returns a JSON-marshalable value.
type Handler func(payload json.RawMessage) (any, error)

// InvokeReply is the wire format for directorInvoke (single return — go-webview panics on value+nil error).
type InvokeReply struct {
	OK    bool   `json:"ok"`
	Data  any    `json:"data,omitempty"`
	Error string `json:"error,omitempty"`
}

// Bridge connects Preact to Go via webview bindings and Eval.
type Bridge struct {
	w        webview.WebView
	mu       sync.RWMutex
	handlers map[string]Handler
}

// New creates a bridge for the given webview instance.
func New(w webview.WebView) *Bridge {
	return &Bridge{
		w:        w,
		handlers: make(map[string]Handler),
	}
}

// Register adds a named RPC method callable from JavaScript as directorInvoke(method, payloadJSON).
// Only register handlers explicitly here or in RegisterFS — do not expose arbitrary Go calls.
func (b *Bridge) Register(method string, h Handler) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.handlers[method] = h
}

// Attach binds directorInvoke on the webview. Call before Navigate.
func (b *Bridge) Attach() error {
	return b.w.Bind("directorInvoke", b.invoke)
}

func (b *Bridge) invoke(method, payload string) InvokeReply {
	b.mu.RLock()
	h, ok := b.handlers[method]
	b.mu.RUnlock()
	if !ok {
		return InvokeReply{OK: false, Error: fmt.Sprintf("unknown method: %s", method)}
	}

	var raw json.RawMessage
	if payload == "" {
		raw = json.RawMessage("{}")
	} else {
		raw = json.RawMessage(payload)
	}

	data, err := h(raw)
	if err != nil {
		return InvokeReply{OK: false, Error: err.Error()}
	}
	return InvokeReply{OK: true, Data: data}
}

// Emit sends an event to the UI (Go → JS). Handlers are registered in the frontend via onDirectorEvent.
func (b *Bridge) Emit(event string, data any) {
	encoded, err := json.Marshal(data)
	if err != nil {
		return
	}
	js := fmt.Sprintf(
		`(function(){var fn=window.__directorOnEvent;if(typeof fn==="function"){fn(%q,%s);}})();`,
		event,
		string(encoded),
	)
	b.w.Eval(js)
}
