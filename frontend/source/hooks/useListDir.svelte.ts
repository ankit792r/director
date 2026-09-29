import { untrack } from "svelte";
import { listDir } from "../bridge/director/listDir";
import { appState } from "../states/state.svelte";
import type { Entry } from "../types";

let settledPath = "";
let requestId = 0;

async function listEntries(
    path: string,
    showHidden: boolean,
    sortBy: typeof appState.sortBy,
    sortDesc: boolean,
): Promise<Entry[]> {
    const reply = await listDir(path, showHidden, sortBy, sortDesc);
    return reply.entries ?? [];
}

/** Reload the panes whenever `appState.cwd` changes. */
export function useListDir() {
    if (!appState.cwd) {
        appState.cwd = appState.config?.startPath || appState.home || "~";
    }

    $effect(() => {
        const path = appState.cwd;
        if (!path || path === settledPath) return;

        const id = ++requestId;
        const { showHidden, sortBy, sortDesc } = untrack(() => ({
            showHidden: appState.showHidden,
            sortBy: appState.sortBy,
            sortDesc: appState.sortDesc,
        }));
        untrack(() => {
            appState.loading = true;
            appState.error = null;
        });

        void (async () => {
            try {
                const reply = await listDir(path, showHidden, sortBy, sortDesc);

                console.log("reply", reply);
                if (id !== requestId) return;

                const entries = reply.entries ?? [];
                const current = entries[appState.cursor]; // TODO: this will be get from appState.cursor
                const [parentEntries, rightEntries] = await Promise.all([
                    reply.parent
                        ? listEntries(reply.parent, showHidden, sortBy, sortDesc).catch(() => [] as Entry[])
                        : Promise.resolve([] as Entry[]),
                    current?.isDir
                        ? listEntries(current.path, showHidden, sortBy, sortDesc).catch(() => [] as Entry[])
                        : Promise.resolve([] as Entry[]),
                ]);
                if (id !== requestId) return;

                const resolved = reply.path || path;
                settledPath = resolved;
                untrack(() => {
                    appState.entries = entries;
                    appState.parent = reply.parent;
                    appState.cursor = entries.length > 0 ? 0 : -1;
                    appState.marked = new Set();
                    appState.parentEntries = parentEntries;
                    appState.rightEntries = rightEntries;
                    appState.rightIsDir = current?.isDir ?? false;
                    appState.loading = false;
                    if (resolved !== appState.cwd) appState.cwd = resolved;
                });
            } catch (err) {
                if (id !== requestId) return;
                untrack(() => {
                    appState.error = err instanceof Error ? err.message : String(err);
                    appState.loading = false;
                });
            }
        })();

        return () => {
            if (id === requestId) requestId++;
        };
    });
}
