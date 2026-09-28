package director

type Config struct {
	StartPath   string            `json:"startPath"`
	ShowHidden  bool              `json:"showHidden"`
	SortBy      string            `json:"sortBy"`
	SortDesc    bool              `json:"sortDesc"`
	Bookmarks   map[string]string `json:"bookmarks"`
	KeymapHints bool              `json:"keymapHints"`
}

func defaultConfig() Config {
	return Config{
		SortBy:      "name",
		Bookmarks:   map[string]string{},
		KeymapHints: true,
	}
}
