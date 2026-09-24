package bridge

import (
	"encoding/json"

	"director/backbone/fs"
)

// RegisterFS exposes filesystem RPC methods to the UI.
func RegisterFS(b *Bridge) {
	b.Register("homeDir", rpcHomeDir)
	b.Register("listDir", rpcListDir)
	b.Register("stat", rpcStat)
	b.Register("mkdir", rpcMkdir)
	b.Register("createFile", rpcCreateFile)
	b.Register("rename", rpcRename)
	b.Register("transfer", rpcTransfer)
	b.Register("remove", rpcRemove)
	b.Register("open", rpcOpen)
	b.Register("readPreview", rpcReadPreview)
	b.Register("runShell", rpcRunShell)
	b.Register("getConfig", rpcGetConfig)
	b.Register("saveConfig", rpcSaveConfig)
}

func rpcHomeDir(_ json.RawMessage) (any, error) {
	path, err := fs.HomeDir()
	if err != nil {
		return nil, err
	}
	return map[string]string{"path": path}, nil
}

func rpcListDir(raw json.RawMessage) (any, error) {
	var req fs.ListDirRequest
	if err := json.Unmarshal(raw, &req); err != nil {
		return nil, err
	}
	return fs.ListDir(req)
}

func rpcStat(raw json.RawMessage) (any, error) {
	var req fs.PathRequest
	if err := json.Unmarshal(raw, &req); err != nil {
		return nil, err
	}
	return fs.Stat(req.Path)
}

func rpcMkdir(raw json.RawMessage) (any, error) {
	var req fs.PathRequest
	if err := json.Unmarshal(raw, &req); err != nil {
		return nil, err
	}
	return fs.Mkdir(req.Path)
}

func rpcCreateFile(raw json.RawMessage) (any, error) {
	var req fs.PathRequest
	if err := json.Unmarshal(raw, &req); err != nil {
		return nil, err
	}
	return fs.CreateFile(req.Path)
}

func rpcRename(raw json.RawMessage) (any, error) {
	var req fs.RenameRequest
	if err := json.Unmarshal(raw, &req); err != nil {
		return nil, err
	}
	return fs.Rename(req.Path, req.NewName)
}

func rpcTransfer(raw json.RawMessage) (any, error) {
	var req fs.TransferRequest
	if err := json.Unmarshal(raw, &req); err != nil {
		return nil, err
	}
	return fs.Transfer(req)
}

func rpcRemove(raw json.RawMessage) (any, error) {
	var req struct {
		Paths     []string `json:"paths"`
		Permanent bool     `json:"permanent"`
	}
	if err := json.Unmarshal(raw, &req); err != nil {
		return nil, err
	}
	return fs.Remove(req.Paths, req.Permanent)
}

func rpcOpen(raw json.RawMessage) (any, error) {
	var req fs.PathRequest
	if err := json.Unmarshal(raw, &req); err != nil {
		return nil, err
	}
	if err := fs.Open(req.Path); err != nil {
		return nil, err
	}
	return map[string]bool{"ok": true}, nil
}

func rpcReadPreview(raw json.RawMessage) (any, error) {
	var req fs.PreviewRequest
	if err := json.Unmarshal(raw, &req); err != nil {
		return nil, err
	}
	return fs.ReadPreview(req)
}

func rpcRunShell(raw json.RawMessage) (any, error) {
	var req fs.ShellRequest
	if err := json.Unmarshal(raw, &req); err != nil {
		return nil, err
	}
	return fs.RunShell(req)
}

func rpcGetConfig(_ json.RawMessage) (any, error) {
	return fs.LoadConfig()
}

func rpcSaveConfig(raw json.RawMessage) (any, error) {
	var cfg fs.Config
	if err := json.Unmarshal(raw, &cfg); err != nil {
		return nil, err
	}
	if err := fs.SaveConfig(cfg); err != nil {
		return nil, err
	}
	return map[string]bool{"ok": true}, nil
}
