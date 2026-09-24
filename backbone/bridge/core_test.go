package bridge

import (
	"encoding/json"
	"testing"
)

func TestPing(t *testing.T) {
	raw, _ := json.Marshal(PingRequest{Message: "test"})
	got, err := ping(raw)
	if err != nil {
		t.Fatal(err)
	}
	resp, ok := got.(PingResponse)
	if !ok {
		t.Fatalf("got %T", got)
	}
	if resp.Message != "pong: test" {
		t.Fatalf("message: %q", resp.Message)
	}
	if resp.Runtime == "" {
		t.Fatal("expected runtime")
	}
}
