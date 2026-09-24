package fs

import (
	"errors"
	"os"
	"os/user"
	"path/filepath"
	"strings"
)

// HomeDir returns the user's home directory.
func HomeDir() (string, error) {
	if h, err := os.UserHomeDir(); err == nil && h != "" {
		return filepath.Clean(h), nil
	}
	u, err := user.Current()
	if err != nil {
		return "", err
	}
	if u.HomeDir == "" {
		return "", errors.New("home directory not found")
	}
	return filepath.Clean(u.HomeDir), nil
}

// ExpandPath resolves ~ and cleans a path.
func ExpandPath(p string) (string, error) {
	p = strings.TrimSpace(p)
	if p == "" {
		return "", errors.New("empty path")
	}
	if p == "~" || strings.HasPrefix(p, "~/") {
		home, err := HomeDir()
		if err != nil {
			return "", err
		}
		if p == "~" {
			return home, nil
		}
		return filepath.Clean(filepath.Join(home, p[2:])), nil
	}
	if !filepath.IsAbs(p) {
		wd, err := os.Getwd()
		if err != nil {
			return "", err
		}
		p = filepath.Join(wd, p)
	}
	return filepath.Clean(p), nil
}

// ParentDir returns the parent of path, or "" at filesystem root.
func ParentDir(p string) string {
	p = filepath.Clean(p)
	parent := filepath.Dir(p)
	if parent == p {
		return ""
	}
	return parent
}
