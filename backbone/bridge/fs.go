package bridge

import (
	"director/backbone/director"
	"encoding/json"
)

func RegisterFS(b *Bridge) {
	b.Register("list", handleListDir)
}

func handleListDir(raw json.RawMessage) (any, error) {
	var listReq director.ListDirRequest
	if err := json.Unmarshal(raw, &listReq); err != nil {
		return nil, err
	}

	return director.ListDir(listReq)
}
