package director

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
