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
});