package director

// PreviewRequest reads a small preview of a file.
type PreviewRequest struct {
	Path     string `json:"path"`
	MaxBytes int    `json:"maxBytes"`
}

// PreviewResponse is file preview data.
type PreviewResponse struct {
	Path      string `json:"path"`
	Kind      string `json:"kind"` // text, image, binary, directory
	Mime      string `json:"mime,omitempty"`
	Text      string `json:"text,omitempty"`
	Base64    string `json:"base64,omitempty"`
	Truncated bool   `json:"truncated,omitempty"`
}
