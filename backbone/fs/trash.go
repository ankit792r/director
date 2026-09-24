package fs

import (
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

// Trash moves a file or directory into the freedesktop trash directory.
func Trash(path string) error {
	home, err := HomeDir()
	if err != nil {
		return err
	}
	trashFiles := filepath.Join(home, ".local", "share", "Trash", "files")
	trashInfo := filepath.Join(home, ".local", "share", "Trash", "info")
	if err := os.MkdirAll(trashFiles, 0o755); err != nil {
		return err
	}
	if err := os.MkdirAll(trashInfo, 0o755); err != nil {
		return err
	}

	base := filepath.Base(path)
	dest := filepath.Join(trashFiles, base)
	dest = uniquePath(dest)

	if err := os.Rename(path, dest); err != nil {
		return err
	}

	infoPath := filepath.Join(trashInfo, base+".trashinfo")
	if dest != filepath.Join(trashFiles, base) {
		infoPath = filepath.Join(trashInfo, filepath.Base(dest)+".trashinfo")
	}
	body := "[Trash Info]\nPath=" + path + "\nDeletionDate=" + time.Now().Format("2006-01-02T15:04:05") + "\n"
	return os.WriteFile(infoPath, []byte(body), 0o644)
}

func uniquePath(p string) string {
	if _, err := os.Stat(p); os.IsNotExist(err) {
		return p
	}
	dir := filepath.Dir(p)
	base := filepath.Base(p)
	for i := 1; i < 1000; i++ {
		candidate := filepath.Join(dir, base+"."+itoa(i))
		if _, err := os.Stat(candidate); os.IsNotExist(err) {
			return candidate
		}
	}
	return p
}

func itoa(i int) string {
	if i == 0 {
		return "0"
	}
	var b [20]byte
	n := len(b)
	for i > 0 {
		n--
		b[n] = byte('0' + i%10)
		i /= 10
	}
	return string(b[n:])
}

// Open opens a path with the system default application.
func Open(path string) error {
	p, err := ExpandPath(path)
	if err != nil {
		return err
	}
	return exec.Command("xdg-open", p).Start()
}
