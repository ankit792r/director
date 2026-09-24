import type {
  Clipboard,
  DirectorConfig,
  Entry,
  PreviewState,
  SortBy,
} from '../types/fs.ts'

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
  helpOpen: boolean
  history: string[]
  historyIndex: number
  config: DirectorConfig | null
  home: string
  loading: boolean
}

export const initialState: AppState = {
  cwd: '',
  parent: '',
  entries: [],
  cursor: 0,
  marked: new Set(),
  clipboard: null,
  showHidden: false,
  sortBy: 'name',
  sortDesc: false,
  filter: '',
  preview: null,
  previewOpen: true,
  parentEntries: [],
  rightEntries: [],
  rightIsDir: false,
  status: '',
  error: null,
  commandOpen: false,
  commandValue: '',
  commandMode: 'path',
  helpOpen: false,
  history: [],
  historyIndex: -1,
  config: null,
  home: '',
  loading: true,
}

export function visibleEntries(state: AppState): Entry[] {
  const q = state.filter.trim().toLowerCase()
  if (!q) return state.entries
  return state.entries.filter((e) => e.name.toLowerCase().includes(q))
}

export function formatSize(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KiB`
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MiB`
  return `${(n / 1024 / 1024 / 1024).toFixed(1)} GiB`
}

export function shortenPath(path: string, home: string): string {
  if (home && path.startsWith(home)) {
    return '~' + path.slice(home.length)
  }
  return path
}
