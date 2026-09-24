package fs

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

// ListDirRequest lists a directory.
type ListDirRequest struct {
	Path       string `json:"path"`
	ShowHidden bool   `json:"showHidden"`
	SortBy     string `json:"sortBy"` // name, mtime, size
	SortDesc   bool   `json:"sortDesc"`
}

// ListDirResponse is the result of listing a directory.
type ListDirResponse struct {
	Path    string  `json:"path"`
	Parent  string  `json:"parent"`
	Entries []Entry `json:"entries"`
}

// PathRequest is a single path argument.
type PathRequest struct {
	Path string `json:"path"`
}

// RenameRequest renames one path.
type RenameRequest struct {
	Path    string `json:"path"`
	NewName string `json:"newName"`
}

// TransferRequest copies or moves paths into a destination directory.
type TransferRequest struct {
	Sources []string `json:"sources"`
	DestDir string   `json:"destDir"`
	Mode    string   `json:"mode"` // copy | move
}

// TransferResult summarizes a transfer operation.
type TransferResult struct {
	OK      int      `json:"ok"`
	Skipped int      `json:"skipped"`
	Errors  []string `json:"errors,omitempty"`
}

// PreviewRequest reads a small preview of a file.
type PreviewRequest struct {
	Path    string `json:"path"`
	MaxBytes int   `json:"maxBytes"`
}

// PreviewResponse is file preview data.
type PreviewResponse struct {
	Path     string `json:"path"`
	Kind     string `json:"kind"` // text, image, binary, directory
	Mime     string `json:"mime,omitempty"`
	Text     string `json:"text,omitempty"`
	Base64   string `json:"base64,omitempty"`
	Truncated bool  `json:"truncated,omitempty"`
}

// ShellRequest runs a shell command in a working directory.
type ShellRequest struct {
	Dir     string `json:"dir"`
	Command string `json:"command"`
}

// ShellResponse is command output.
type ShellResponse struct {
	ExitCode int    `json:"exitCode"`
	Stdout   string `json:"stdout"`
	Stderr   string `json:"stderr"`
}
