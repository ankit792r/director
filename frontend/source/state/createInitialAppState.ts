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
