export type Entry = {
    name: string
    path: string
    isDir: boolean
    size: number
    modTime: number
    mode: string
    linkTarget?: string
}

export type ListDirResponse = {
    path: string
    parent: string
    entries: Entry[]
}

export type DirectorConfig = {
    startPath?: string
    showHidden: boolean
    sortBy: "name" | "mtime" | "size"
    sortDesc: boolean
    bookmarks: Record<string, string>
    keymapHints?: boolean
}

export type ClipboardMode = "copy" | "cut"

export type Clipboard = {
    mode: ClipboardMode
    paths: string[]
} | null

export type PreviewState = {
    path: string
    kind: string
    text?: string
    base64?: string
    mime?: string
    truncated?: boolean
} | null

export type SortBy = DirectorConfig["sortBy"]

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
    commandMode: "path" | "shell" | "rename" | "mkdir" | "create" | "filter"
    shellOutput: { stdout: string; stderr: string; exitCode: number } | null
    helpOpen: boolean
    history: string[]
    historyIndex: number
    config: DirectorConfig | null
    home: string
    loading: boolean
}
