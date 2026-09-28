package director

// RenameRequest renames one path.
type RenameRequest struct {
	Path    string `json:"path"`
	NewName string `json:"newName"`
}
