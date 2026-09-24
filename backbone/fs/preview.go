package fs

import (
	"encoding/base64"
	"mime"
	"os"
	"path/filepath"
	"strings"
)

// ReadPreview returns a bounded preview for a file.
func ReadPreview(req PreviewRequest) (PreviewResponse, error) {
	p, err := ExpandPath(req.Path)
	if err != nil {
		return PreviewResponse{}, err
	}
	info, err := os.Lstat(p)
	if err != nil {
		return PreviewResponse{}, err
	}
	if info.IsDir() {
		return PreviewResponse{Path: p, Kind: "directory"}, nil
	}

	max := req.MaxBytes
	if max <= 0 {
		max = 64 * 1024
	}

	ext := strings.ToLower(filepath.Ext(p))
	mimeType := mime.TypeByExtension(ext)
	if mimeType == "" {
		mimeType = "application/octet-stream"
	}

	if strings.HasPrefix(mimeType, "image/") && info.Size() <= int64(max) {
		data, err := os.ReadFile(p)
		if err != nil {
			return PreviewResponse{}, err
		}
		return PreviewResponse{
			Path:   p,
			Kind:   "image",
			Mime:   mimeType,
			Base64: base64.StdEncoding.EncodeToString(data),
		}, nil
	}

	data, err := os.ReadFile(p)
	if err != nil {
		return PreviewResponse{}, err
	}
	truncated := false
	if len(data) > max {
		data = data[:max]
		truncated = true
	}
	if isText(data) {
		return PreviewResponse{
			Path:      p,
			Kind:      "text",
			Mime:      mimeType,
			Text:      string(data),
			Truncated: truncated,
		}, nil
	}
	return PreviewResponse{Path: p, Kind: "binary", Mime: mimeType}, nil
}

func isText(b []byte) bool {
	if len(b) == 0 {
		return true
	}
	for _, c := range b {
		if c == 0 {
			return false
		}
	}
	return true
}
