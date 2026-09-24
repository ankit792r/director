# Director

Keyboard-first file manager (Go + Preact + WebView).

## Development

```bash
# Terminal 1 — UI with hot reload
cd frontend && bun run dev

# Terminal 2 — native shell (loads http://localhost:5173)
DIRECTOR_DEV=1 go run .
```

## Production build

```bash
make build
./bin/director
```

Config: `~/.config/director/config.json`
