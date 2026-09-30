import { useEffect } from "preact/hooks"
import { listDir } from "../bridge/director/listDir"
import { useAppState, useUpdateAppState } from "../state/appState"
import type { Entry } from "../types/entry"
import type { SortBy } from "../types/state"

let settledLoadKey = ""
let requestId = 0

function loadKey(cwd: string, showHidden: boolean, sortBy: SortBy, sortDesc: boolean) {
    return `${cwd}\0${showHidden}\0${sortBy}\0${sortDesc}`
}

async function listEntries(
    path: string,
    showHidden: boolean,
    sortBy: SortBy,
    sortDesc: boolean,
): Promise<Entry[]> {
    const reply = await listDir(path, showHidden, sortBy, sortDesc)
    return reply.entries ?? []
}

/** Reload the panes whenever `cwd` changes. */
export function useListDir() {
    const { cwd, config, home, showHidden, sortBy, sortDesc } = useAppState()
    const update = useUpdateAppState()

    useEffect(() => {
        if (!cwd) {
            update({ cwd: config?.startPath || home || "~" })
        }
    }, [cwd, config, home, update])

    useEffect(() => {
        const path = cwd
        const key = loadKey(path, showHidden, sortBy, sortDesc)
        if (!path || key === settledLoadKey) return

        const id = ++requestId
        update({ loading: true, error: null })

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
                settledLoadKey = loadKey(resolved, showHidden, sortBy, sortDesc)
                update({
                    entries,
                    parent: reply.parent,
                    cursor: entries.length > 0 ? 0 : -1,
                    marked: new Set(),
                    parentEntries,
                    rightEntries,
                    rightIsDir: current?.isDir ?? false,
                    loading: false,
                    ...(resolved !== path ? { cwd: resolved } : {}),
                })
            } catch (err) {
                if (id !== requestId) return
                update({
                    error: err instanceof Error ? err.message : String(err),
                    loading: false,
                })
            }
        })()

        return () => {
            if (id === requestId) requestId++
        }
    }, [cwd, showHidden, sortBy, sortDesc, update])
}
