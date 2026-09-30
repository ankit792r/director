
export type Entry = {
    name: string
    path: string
    isDir: boolean
    size: number
    modTime: number
    mode: string
    linkTarget?: string
}