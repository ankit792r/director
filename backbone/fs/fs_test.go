package fs

import (
	"os"
	"path/filepath"
	"testing"
)

func TestExpandPathHome(t *testing.T) {
	home, err := HomeDir()
	if err != nil {
		t.Fatal(err)
	}
	got, err := ExpandPath("~/")
	if err != nil {
		t.Fatal(err)
	}
	if got != home {
		t.Fatalf("got %q want %q", got, home)
	}
}

func TestListDirSort(t *testing.T) {
	dir := t.TempDir()
	_ = os.WriteFile(filepath.Join(dir, "b.txt"), []byte("x"), 0o644)
	_ = os.WriteFile(filepath.Join(dir, "a.txt"), []byte("x"), 0o644)
	_ = os.Mkdir(filepath.Join(dir, "c_dir"), 0o755)

	resp, err := ListDir(ListDirRequest{Path: dir, SortBy: "name"})
	if err != nil {
		t.Fatal(err)
	}
	if len(resp.Entries) != 3 {
		t.Fatalf("entries: %d", len(resp.Entries))
	}
	if !resp.Entries[0].IsDir {
		t.Fatal("expected directory first")
	}
}

func TestRenameAndRemove(t *testing.T) {
	dir := t.TempDir()
	src := filepath.Join(dir, "old.txt")
	if err := os.WriteFile(src, []byte("hi"), 0o644); err != nil {
		t.Fatal(err)
	}
	ent, err := Rename(src, "new.txt")
	if err != nil {
		t.Fatal(err)
	}
	if ent.Name != "new.txt" {
		t.Fatalf("name %q", ent.Name)
	}
	res, err := Remove([]string{ent.Path}, true)
	if err != nil {
		t.Fatal(err)
	}
	if res.OK != 1 {
		t.Fatalf("ok %d", res.OK)
	}
}
