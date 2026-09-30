import { useEffect } from "preact/hooks"
import { listDir } from "../bridge/director/listDir"
import { appState, notifyAppState, useAppState } from "../state/appState"
import type { Entry } from "../types/entry"
import type { SortBy } from "../types/state"

let settledPath = ""
let requestId = 0

async function listEntries(
    path: string,
    showHidden: boolean,
    sortBy: SortBy,
    sortDesc: boolean,
): Promise<Entry[]> {
    const reply = await listDir(path, showHidden, sortBy, sortDesc)
    return reply.entries ?? []
}

/** Reload the panes whenever `appState.cwd` changes. */
export function useListDir() {
    const { cwd } = useAppState()

    useEffect(() => {
        if (!appState.cwd) {
            appState.cwd = appState.config?.startPath || appState.home || "~"
            notifyAppState()
        }
    }, [])

    useEffect(() => {
        const path = cwd || appState.cwd
        if (!path || path === settledPath) return

        const id = ++requestId
        const { showHidden, sortBy, sortDesc } = appState
        appState.loading = true
        appState.error = null
        notifyAppState()

        void (async () => {
            try {
                const reply = await listDir(path, showHidden, sortBy, sortDesc)
                if (id !== requestId) return

                const entries = reply.entries ?? []
                const current = entries[0]
                const [parentEntries, rightEntries] = await Promise.all([
                    reply.parent
                        ? listEntries(reply.parent, showHidden, sortBy, sortDesc).catch(() => [] as Entry[])
                        : Promise.resolve([] as Entry[]),
                    current?.isDir
                        ? listEntries(current.path, showHidden, sortBy, sortDesc).catch(() => [] as Entry[])
                        : Promise.resolve([] as Entry[]),
                ])
                if (id !== requestId) return

                const resolved = reply.path || path
                settledPath = resolved
                appState.entries = entries
                appState.parent = reply.parent
                appState.cursor = entries.length > 0 ? 0 : -1
                appState.marked = new Set()
                appState.parentEntries = parentEntries
                appState.rightEntries = rightEntries
                appState.rightIsDir = current?.isDir ?? false
                appState.loading = false
                if (resolved !== appState.cwd) appState.cwd = resolved
                notifyAppState()
            } catch (err) {
                if (id !== requestId) return
                appState.error = err instanceof Error ? err.message : String(err)
                appState.loading = false
                notifyAppState()
            }
        })()

        return () => {
            if (id === requestId) requestId++
        }
    }, [cwd])
}
