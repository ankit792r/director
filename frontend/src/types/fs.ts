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
  sortBy: 'name' | 'mtime' | 'size'
  sortDesc: boolean
  bookmarks: Record<string, string>
  keymapHints?: boolean
}

export type ClipboardMode = 'copy' | 'cut'

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

export type SortBy = DirectorConfig['sortBy']
