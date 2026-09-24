package fs

import (
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// ListDir reads and sorts directory entries.
func ListDir(req ListDirRequest) (ListDirResponse, error) {
	dir, err := ExpandPath(req.Path)
	if err != nil {
		return ListDirResponse{}, err
	}
	info, err := os.Stat(dir)
	if err != nil {
		return ListDirResponse{}, err
	}
	if !info.IsDir() {
		return ListDirResponse{}, &Error{Code: "not_dir", Message: "not a directory"}
	}

	entries, err := os.ReadDir(dir)
	if err != nil {
		return ListDirResponse{}, err
	}

	out := make([]Entry, 0, len(entries))
	for _, de := range entries {
		name := de.Name()
		if !req.ShowHidden && strings.HasPrefix(name, ".") {
			continue
		}
		ent, err := entryFromDirEntry(dir, de)
		if err != nil {
			continue
		}
		out = append(out, ent)
	}

	sortEntries(out, req.SortBy, req.SortDesc)

	return ListDirResponse{
		Path:    dir,
		Parent:  ParentDir(dir),
		Entries: out,
	}, nil
}

func entryFromDirEntry(dir string, de os.DirEntry) (Entry, error) {
	full := filepath.Join(dir, de.Name())
	info, err := de.Info()
	if err != nil {
		info, err = os.Lstat(full)
		if err != nil {
			return Entry{}, err
		}
	}

	mode := info.Mode()
	ent := Entry{
		Name:    de.Name(),
		Path:    full,
		IsDir:   info.IsDir(),
		Size:    info.Size(),
		ModTime: info.ModTime().Unix(),
		Mode:    mode.String(),
	}

	if mode&fs.ModeSymlink != 0 {
		if target, err := os.Readlink(full); err == nil {
			ent.LinkTarget = target
		}
	}
	return ent, nil
}

func sortEntries(entries []Entry, sortBy string, desc bool) {
	if sortBy == "" {
		sortBy = "name"
	}
	less := func(i, j int) bool {
		a, b := entries[i], entries[j]
		if a.IsDir != b.IsDir {
			return a.IsDir && !b.IsDir
		}
		switch sortBy {
		case "mtime":
			if a.ModTime != b.ModTime {
				return a.ModTime < b.ModTime
			}
		case "size":
			if a.Size != b.Size {
				return a.Size < b.Size
			}
		}
		return strings.ToLower(a.Name) < strings.ToLower(b.Name)
	}
	sort.SliceStable(entries, less)
	if desc {
		for i, j := 0, len(entries)-1; i < j; i, j = i+1, j-1 {
			entries[i], entries[j] = entries[j], entries[i]
		}
	}
}

// Stat returns metadata for one path.
func Stat(path string) (Entry, error) {
	p, err := ExpandPath(path)
	if err != nil {
		return Entry{}, err
	}
	info, err := os.Lstat(p)
	if err != nil {
		return Entry{}, err
	}
	mode := info.Mode()
	ent := Entry{
		Name:    filepath.Base(p),
		Path:    p,
		IsDir:   info.IsDir(),
		Size:    info.Size(),
		ModTime: info.ModTime().Unix(),
		Mode:    mode.String(),
	}
	if mode&fs.ModeSymlink != 0 {
		if target, err := os.Readlink(p); err == nil {
			ent.LinkTarget = target
		}
	}
	return ent, nil
}
