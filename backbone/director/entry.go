package director

// Entry describes one directory entry for the UI.
type Entry struct {
	Name       string `json:"name"`
	Path       string `json:"path"`
	IsDir      bool   `json:"isDir"`
	Size       int64  `json:"size"`
	ModTime    int64  `json:"modTime"`
	Mode       string `json:"mode"`
	LinkTarget string `json:"linkTarget,omitempty"`
}
