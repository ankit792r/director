package bridge

import (
	"encoding/json"
	"runtime"
)

// PingRequest is the payload for the ping RPC (connectivity check).
type PingRequest struct {
	Message string `json:"message,omitempty"`
}

// PingResponse is returned from ping.
type PingResponse struct {
	Message string `json:"message"`
	Runtime string `json:"runtime"`
}

// RegisterCore registers built-in methods used by the bridge itself and smoke tests.
func RegisterCore(b *Bridge) {
	b.Register("ping", func(raw json.RawMessage) (any, error) {
		resp, err := ping(raw)
		if err != nil {
			return nil, err
		}
		b.Emit("director:ready", resp)
		return resp, nil
	})
}

func ping(raw json.RawMessage) (any, error) {
	var req PingRequest
	if len(raw) > 0 {
		_ = json.Unmarshal(raw, &req)
	}
	msg := "pong"
	if req.Message != "" {
		msg = "pong: " + req.Message
	}
	return PingResponse{
		Message: msg,
		Runtime: runtime.Version(),
	}, nil
}
