import type { Entry } from "../types"
import type { AppState } from "../states/state.svelte"

export function visibleEntries(state: AppState): Entry[] {
    const q = state.filter.trim().toLowerCase()
    if (!q) return state.entries
    return state.entries.filter((e) => e.name.toLowerCase().includes(q))
}

export function formatSize(n: number): string {
    if (n < 1024) return `${n} B`
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KiB`
    if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MiB`
    return `${(n / 1024 / 1024 / 1024).toFixed(1)} GiB`
}

export function shortenPath(path: string, home: string): string {
    if (home && path.startsWith(home)) {
        return '~' + path.slice(home.length)
    }
    return path
}
