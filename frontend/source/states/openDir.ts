import { listDir } from "../bridge/director/listDir"
import type { Entry } from "../types"
import { appState } from "./state.svelte"

let requestId = 0

function listCurrent(path: string) {
    return listDir(path, appState.showHidden, appState.sortBy, appState.sortDesc)
}

async function listEntries(path: string): Promise<Entry[]> {
    const reply = await listCurrent(path)
    return reply.entries ?? []
}

/** Load a directory into the center pane, then the parent and preview panes. */
export async function openDir(path: string) {
    const id = ++requestId
    appState.loading = true
    appState.error = null

    try {
        const reply = await listCurrent(path)
        if (id !== requestId) return

        const entries = reply.entries ?? []
        appState.cwd = reply.path
        appState.parent = reply.parent
        appState.entries = entries
        appState.cursor = entries.length > 0 ? 0 : -1
        appState.marked = new Set()

        const current = entries[appState.cursor]
        const [parentEntries, rightEntries] = await Promise.all([
            reply.parent ? listEntries(reply.parent).catch(() => [] as Entry[]) : Promise.resolve([] as Entry[]),
            current?.isDir ? listEntries(current.path).catch(() => [] as Entry[]) : Promise.resolve([] as Entry[]),
        ])
        if (id !== requestId) return

        appState.parentEntries = parentEntries
        appState.rightEntries = rightEntries
        appState.rightIsDir = current?.isDir ?? false
    } catch (err) {
        if (id !== requestId) return
        appState.error = err instanceof Error ? err.message : String(err)
    } finally {
        if (id === requestId) appState.loading = false
    }
}
