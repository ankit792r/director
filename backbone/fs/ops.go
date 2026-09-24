package fs

import (
	"io"
	"os"
	"path/filepath"
	"strings"
)

// Mkdir creates a directory.
func Mkdir(path string) (Entry, error) {
	p, err := ExpandPath(path)
	if err != nil {
		return Entry{}, err
	}
	if err := os.MkdirAll(p, 0o755); err != nil {
		return Entry{}, err
	}
	return Stat(p)
}

// CreateFile creates an empty file.
func CreateFile(path string) (Entry, error) {
	p, err := ExpandPath(path)
	if err != nil {
		return Entry{}, err
	}
	if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
		return Entry{}, err
	}
	f, err := os.OpenFile(p, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0o644)
	if err != nil {
		return Entry{}, err
	}
	_ = f.Close()
	return Stat(p)
}

// Rename renames within the same directory (or full path if newName is absolute).
func Rename(path, newName string) (Entry, error) {
	p, err := ExpandPath(path)
	if err != nil {
		return Entry{}, err
	}
	newName = strings.TrimSpace(newName)
	if newName == "" {
		return Entry{}, errf("invalid", "new name is empty")
	}
	dest := filepath.Join(filepath.Dir(p), newName)
	if filepath.IsAbs(newName) {
		dest, err = ExpandPath(newName)
		if err != nil {
			return Entry{}, err
		}
	}
	if err := os.Rename(p, dest); err != nil {
		return Entry{}, err
	}
	return Stat(dest)
}

// Transfer copies or moves sources into destDir.
func Transfer(req TransferRequest) (TransferResult, error) {
	dest, err := ExpandPath(req.DestDir)
	if err != nil {
		return TransferResult{}, err
	}
	destInfo, err := os.Stat(dest)
	if err != nil {
		return TransferResult{}, err
	}
	if !destInfo.IsDir() {
		return TransferResult{}, errf("not_dir", "destination is not a directory")
	}

	var result TransferResult
	move := req.Mode == "move"

	for _, src := range req.Sources {
		from, err := ExpandPath(src)
		if err != nil {
			result.Errors = append(result.Errors, err.Error())
			continue
		}
		target := filepath.Join(dest, filepath.Base(from))
		if from == target {
			result.Skipped++
			continue
		}
		if _, err := os.Stat(target); err == nil {
			result.Errors = append(result.Errors, "exists: "+target)
			continue
		}

		if move {
			if err := os.Rename(from, target); err != nil {
				if copyPath(from, target) == nil {
					_ = os.RemoveAll(from)
					result.OK++
					continue
				}
				result.Errors = append(result.Errors, err.Error())
				continue
			}
			result.OK++
			continue
		}

		if err := copyPath(from, target); err != nil {
			result.Errors = append(result.Errors, err.Error())
			continue
		}
		result.OK++
	}
	return result, nil
}

func copyPath(src, dst string) error {
	info, err := os.Stat(src)
	if err != nil {
		return err
	}
	if info.IsDir() {
		return copyDir(src, dst)
	}
	return copyFile(src, dst)
}

func copyFile(src, dst string) error {
	if err := os.MkdirAll(filepath.Dir(dst), 0o755); err != nil {
		return err
	}
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.OpenFile(dst, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o644)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}

func copyDir(src, dst string) error {
	return filepath.WalkDir(src, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}
		target := filepath.Join(dst, rel)
		if d.IsDir() {
			return os.MkdirAll(target, 0o755)
		}
		return copyFile(path, target)
	})
}

// Remove sends paths to trash when permanent is false.
func Remove(paths []string, permanent bool) (TransferResult, error) {
	var result TransferResult
	for _, p := range paths {
		full, err := ExpandPath(p)
		if err != nil {
			result.Errors = append(result.Errors, err.Error())
			continue
		}
		var errRemove error
		if permanent {
			errRemove = os.RemoveAll(full)
		} else {
			errRemove = Trash(full)
		}
		if errRemove != nil {
			result.Errors = append(result.Errors, errRemove.Error())
			continue
		}
		result.OK++
	}
	return result, nil
}
