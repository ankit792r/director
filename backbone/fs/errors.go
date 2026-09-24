package fs

import "fmt"

// Error is a filesystem error exposed to the UI.
type Error struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func (e *Error) Error() string {
	if e.Code != "" {
		return fmt.Sprintf("%s: %s", e.Code, e.Message)
	}
	return e.Message
}

func errf(code, msg string) error {
	return &Error{Code: code, Message: msg}
}
