
export type DirectorConfig = {
    startPath?: string
    showHidden: boolean
    sortBy: "name" | "mtime" | "size"
    sortDesc: boolean
    bookmarks: Record<string, string>
    keymapHints?: boolean
}


