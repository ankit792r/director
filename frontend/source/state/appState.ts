import { useEffect, useReducer } from "preact/hooks"
import type { AppState } from "../types/state"

export function createInitialAppState(): AppState {
    return {
        cwd: "",
        parent: "",
        entries: [],
        cursor: -1,
        marked: new Set(),
        clipboard: null,
        showHidden: false,
        sortBy: "name",
        sortDesc: false,
        filter: "",
        preview: null,
        previewOpen: true,
        parentEntries: [],
        rightEntries: [],
        rightIsDir: false,
        status: "",
        error: null,
        commandOpen: false,
        commandValue: "",
        commandMode: "path",
        shellOutput: null,
        helpOpen: false,
        history: [],
        historyIndex: 0,
        config: null,
        home: "",
        loading: true,
    }
}

export let appState: AppState = createInitialAppState()

const listeners = new Set<() => void>()

export function notifyAppState() {
    listeners.forEach((l) => l())
}

/** Subscribe so components re-render when `appState` is updated via `notifyAppState`. */
export function useAppState(): AppState {
    const [, bump] = useReducer((n: number) => n + 1, 0)
    useEffect(() => {
        const listener = () => {
            bump(0)
        }
        listeners.add(listener)
        return () => {
            listeners.delete(listener)
        }
    }, [])
    return appState
}