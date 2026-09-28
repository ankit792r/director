import type { Entry, DirectorConfig, Clipboard, PreviewState, SortBy } from "../types"

export type AppState = {
    cwd: string
    parent: string
    entries: Entry[]
    cursor: number
    marked: Set<string>
    clipboard: Clipboard
    showHidden: boolean
    sortBy: SortBy
    sortDesc: boolean
    filter: string
    preview: PreviewState
    previewOpen: boolean
    parentEntries: Entry[]
    rightEntries: Entry[]
    rightIsDir: boolean
    status: string
    error: string | null
    commandOpen: boolean
    commandValue: string
    commandMode: 'path' | 'shell' | 'rename' | 'mkdir' | 'create' | 'filter'
    shellOutput: { stdout: string; stderr: string; exitCode: number } | null
    helpOpen: boolean
    history: string[]
    historyIndex: number
    config: DirectorConfig | null
    home: string
    loading: boolean
  
}


export let appState: AppState = $state({
    cwd: "",
    parent: "",
    entries: [
        {
            name: "test",
            path: "/test",
            isDir: true,
            size: 1000,
            modTime: 1000,
            mode: "drwxr-xr-x",
        },
        {
            name: "test.txt",
            path: "/test.txt",
            isDir: false,
            size: 1000,
            modTime: 1000,
            mode: "-rw-r--r--",
        },
        {
            name: "test2",
            path: "/test2",
            isDir: false,
            size: 1000,
            modTime: 1000,
            mode: "-rw-r--r--",
        },
    ],
    cursor: 0,
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
});