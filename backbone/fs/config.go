package fs

import (
	"encoding/json"
	"os"
	"path/filepath"
)
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

func configPath() (string, error) {
	home, err := HomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, ".config", "director", "config.json"), nil
}

// LoadConfig reads config from disk or returns defaults.
func LoadConfig() (Config, error) {
	cfg := defaultConfig()
	path, err := configPath()
	if err != nil {
		return cfg, err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			applyStartPathEnv(&cfg)
			return cfg, nil
		}
		return cfg, err
	}
	if err := json.Unmarshal(data, &cfg); err != nil {
		return defaultConfig(), err
	}
	if cfg.Bookmarks == nil {
		cfg.Bookmarks = map[string]string{}
	}
	applyStartPathEnv(&cfg)
	return cfg, nil
}

func applyStartPathEnv(cfg *Config) {
	if p := os.Getenv("DIRECTOR_START_PATH"); p != "" {
		if expanded, err := ExpandPath(p); err == nil {
			cfg.StartPath = expanded
		}
	}
}

// SaveConfig writes config to disk.
func SaveConfig(cfg Config) error {
	path, err := configPath()
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	data, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0o644)
}
