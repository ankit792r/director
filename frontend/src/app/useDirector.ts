import { useCallback, useEffect, useReducer, useRef } from 'preact/hooks'
import {
  createFilePath,
  fetchConfig,
  fetchHome,
  listDir,
  mkdirPath,
  openPath,
  readPreview,
  removePaths,
  renamePath,
  runShell,
  saveConfig,
  transfer,
} from '../api/fs.ts'
import { invoke } from '../bridge/director.ts'
import {
  formatSize,
  initialState,
  visibleEntries,
  type AppState,
} from './state.ts'
import type { Entry } from '../types/fs.ts'

type Action =
  | { type: 'patch'; patch: Partial<AppState> }
  | { type: 'setMarked'; marked: Set<string> }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.patch }
    case 'setMarked':
      return { ...state, marked: action.marked }
    default:
      return state
  }
}

export function useDirector() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  const setStatus = (status: string, error: string | null = null) => {
    dispatch({ type: 'patch', patch: { status, error } })
  }

  const loadRightPanel = useCallback(
    async (ent: Entry | undefined, previewOpen?: boolean) => {
      const open = previewOpen ?? stateRef.current.previewOpen
      if (!ent || !open) {
        dispatch({
          type: 'patch',
          patch: { rightEntries: [], preview: null, rightIsDir: false },
        })
        return
      }
    if (ent.isDir) {
      try {
        const s = stateRef.current
        const resp = await listDir(
          ent.path,
          s.showHidden,
          s.sortBy,
          s.sortDesc,
        )
        dispatch({
          type: 'patch',
          patch: {
            rightEntries: resp.entries,
            preview: null,
            rightIsDir: true,
          },
        })
      } catch {
        dispatch({
          type: 'patch',
          patch: { rightEntries: [], preview: null, rightIsDir: true },
        })
      }
      return
    }
    try {
      const preview = await readPreview(ent.path)
      dispatch({
        type: 'patch',
        patch: { preview, rightEntries: [], rightIsDir: false },
      })
    } catch {
      dispatch({
        type: 'patch',
        patch: { preview: null, rightEntries: [], rightIsDir: false },
      })
    }
  }, [])

  const loadParentPanel = useCallback(async (parentPath: string) => {
    const s = stateRef.current
    if (!parentPath) {
      dispatch({ type: 'patch', patch: { parentEntries: [] } })
      return
    }
    try {
      const resp = await listDir(
        parentPath,
        s.showHidden,
        s.sortBy,
        s.sortDesc,
      )
      dispatch({ type: 'patch', patch: { parentEntries: resp.entries } })
    } catch {
      dispatch({ type: 'patch', patch: { parentEntries: [] } })
    }
  },
  [],
)

  const loadDir = useCallback(
    async (path: string, pushHistory = true) => {
      const s = stateRef.current
      dispatch({ type: 'patch', patch: { loading: true, error: null } })
      try {
        const resp = await listDir(path, s.showHidden, s.sortBy, s.sortDesc)
        let history = s.history
        let historyIndex = s.historyIndex
        if (pushHistory && s.cwd && s.cwd !== path) {
          history = [...s.history.slice(0, historyIndex + 1), s.cwd]
          historyIndex = history.length - 1
        }
        dispatch({
          type: 'patch',
          patch: {
            cwd: resp.path,
            parent: resp.parent,
            entries: resp.entries,
            cursor: 0,
            loading: false,
            history,
            historyIndex,
          },
        })
        void loadParentPanel(resp.parent)
        const first = resp.entries[0]
        if (first) void loadRightPanel(first)
      } catch (err) {
        dispatch({
          type: 'patch',
          patch: {
            loading: false,
            error: err instanceof Error ? err.message : String(err),
          },
        })
      }
    },
    [loadRightPanel, loadParentPanel],
  )

  const refresh = async () => {
    const s = stateRef.current
    await loadDir(s.cwd, false)
    const s2 = stateRef.current
    await loadParentPanel(s2.parent)
    const ent = visibleEntries(s2)[s2.cursor]
    if (ent) await loadRightPanel(ent)
  }

  useEffect(() => {
    void (async () => {
      try {
        const [home, config] = await Promise.all([fetchHome(), fetchConfig()])
        dispatch({
          type: 'patch',
          patch: {
            home,
            config,
            showHidden: config.showHidden,
            sortBy: config.sortBy ?? 'name',
            sortDesc: config.sortDesc,
          },
        })
        await loadDir(config.startPath || home, false)
        setStatus('ready')
      } catch (err) {
        setStatus('', err instanceof Error ? err.message : String(err))
        dispatch({ type: 'patch', patch: { loading: false } })
      }
    })()
  }, [loadDir])

  const entries = visibleEntries(state)
  const current = entries[state.cursor]

  const moveCursor = (delta: number) => {
    if (entries.length === 0) return
    const next = Math.max(0, Math.min(entries.length - 1, state.cursor + delta))
    dispatch({ type: 'patch', patch: { cursor: next } })
    const ent = entries[next]
    if (ent) void loadRightPanel(ent)
  }

  const goParent = () => {
    if (state.parent) void loadDir(state.parent)
  }

  const openEntry = async (ent: Entry) => {
    if (ent.isDir) {
      void loadDir(ent.path)
      return
    }
    try {
      await openPath(ent.path)
      setStatus(`opened ${ent.name}`)
    } catch (err) {
      setStatus('', err instanceof Error ? err.message : String(err))
    }
  }

  const toggleMark = () => {
    if (!current) return
    const marked = new Set(state.marked)
    if (marked.has(current.path)) marked.delete(current.path)
    else marked.add(current.path)
    dispatch({ type: 'setMarked', marked })
    setStatus(`${marked.size} marked`)
  }

  const selectedPaths = (): string[] => {
    if (state.marked.size > 0) return [...state.marked]
    if (current) return [current.path]
    return []
  }

  const yank = (cut: boolean) => {
    const paths = selectedPaths()
    if (paths.length === 0) return
    dispatch({
      type: 'patch',
      patch: { clipboard: { mode: cut ? 'cut' : 'copy', paths } },
    })
    setStatus(`${cut ? 'cut' : 'copy'}: ${paths.length} item(s)`)
  }

  const paste = async () => {
    const clip = state.clipboard
    if (!clip) return
    try {
      const res = await transfer(
        clip.paths,
        state.cwd,
        clip.mode === 'cut' ? 'move' : 'copy',
      )
      if (res.errors?.length) {
        setStatus(`paste: ${res.ok} ok`, res.errors.join('; '))
      } else {
        setStatus(`paste: ${res.ok} item(s)`)
      }
      if (clip.mode === 'cut') {
        dispatch({ type: 'patch', patch: { clipboard: null } })
      }
      dispatch({ type: 'setMarked', marked: new Set() })
      await refresh()
    } catch (err) {
      setStatus('', err instanceof Error ? err.message : String(err))
    }
  }

  const deleteSel = async (permanent: boolean) => {
    const paths = selectedPaths()
    if (paths.length === 0) return
    try {
      const res = await removePaths(paths, permanent)
      if (res.errors?.length) {
        setStatus(`removed ${res.ok}`, res.errors.join('; '))
      } else {
        setStatus(`${permanent ? 'deleted' : 'trashed'} ${res.ok} item(s)`)
      }
      dispatch({ type: 'setMarked', marked: new Set() })
      await refresh()
    } catch (err) {
      setStatus('', err instanceof Error ? err.message : String(err))
    }
  }

  const openCommand = (mode: AppState['commandMode'], initial = '') => {
    dispatch({
      type: 'patch',
      patch: { commandOpen: true, commandMode: mode, commandValue: initial },
    })
  }

  const runCommand = async () => {
    const { commandMode, commandValue, cwd } = stateRef.current
    const value = commandValue.trim()
    dispatch({ type: 'patch', patch: { commandOpen: false, commandValue: '' } })
    if (!value && commandMode !== 'rename') return

    try {
      switch (commandMode) {
        case 'path':
          await loadDir(value.startsWith('~') || value.startsWith('/') ? value : `${cwd}/${value}`)
          break
        case 'filter':
          dispatch({ type: 'patch', patch: { filter: value } })
          setStatus(value ? `filter: ${value}` : 'filter cleared')
          break
        case 'shell': {
          const res = await runShell(cwd, value)
          setStatus(
            res.stderr || res.stdout || `exit ${res.exitCode}`,
            res.exitCode !== 0 ? `exit ${res.exitCode}` : null,
          )
          break
        }
        case 'rename':
          if (current) {
            await renamePath(current.path, value)
            await refresh()
          }
          break
        case 'mkdir':
          await mkdirPath(`${cwd}/${value}`)
          await refresh()
          break
        case 'create':
          await createFilePath(`${cwd}/${value}`)
          await refresh()
          break
      }
    } catch (err) {
      setStatus('', err instanceof Error ? err.message : String(err))
    }
  }

  const cycleSort = async () => {
    const order: AppState['sortBy'][] = ['name', 'mtime', 'size']
    const idx = order.indexOf(state.sortBy)
    const sortBy = order[(idx + 1) % order.length]
    dispatch({ type: 'patch', patch: { sortBy } })
    if (state.config) {
      const cfg = { ...state.config, sortBy }
      await saveConfig(cfg)
      dispatch({ type: 'patch', patch: { config: cfg } })
    }
    await loadDir(state.cwd, false)
    setStatus(`sort: ${sortBy}`)
  }

  const toggleHidden = async () => {
    const showHidden = !state.showHidden
    dispatch({ type: 'patch', patch: { showHidden } })
    if (state.config) {
      const cfg = { ...state.config, showHidden }
      await saveConfig(cfg)
      dispatch({ type: 'patch', patch: { config: cfg } })
    }
    await loadDir(state.cwd, false)
  }

  const bookmark = async (key: string) => {
    if (!state.config) return
    const bookmarks = { ...state.config.bookmarks, [key]: state.cwd }
    const cfg = { ...state.config, bookmarks }
    await saveConfig(cfg)
    dispatch({ type: 'patch', patch: { config: cfg } })
    setStatus(`bookmark ${key} saved`)
  }

  const goBookmark = (key: string) => {
    const path = state.config?.bookmarks[key]
    if (path) void loadDir(path)
  }

  const historyBack = () => {
    const { history, historyIndex } = state
    if (historyIndex < 0) return
    const path = history[historyIndex]
    dispatch({ type: 'patch', patch: { historyIndex: historyIndex - 1 } })
    void loadDir(path, false)
  }

  const historyForward = () => {
    const { history, historyIndex } = state
    if (historyIndex >= history.length - 1) return
    const path = history[historyIndex + 1]
    dispatch({ type: 'patch', patch: { historyIndex: historyIndex + 1 } })
    void loadDir(path, false)
  }

  const quit = () => {
    void invoke('quit').catch(() => undefined)
  }

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const s = stateRef.current
      if (s.commandOpen) {
        if (ev.key === 'Escape') {
          dispatch({ type: 'patch', patch: { commandOpen: false, commandValue: '' } })
          ev.preventDefault()
        }
        if (ev.key === 'Enter') {
          void runCommand()
          ev.preventDefault()
        }
        return
      }
      if (s.helpOpen) {
        if (ev.key === 'Escape' || ev.key === '?') {
          dispatch({ type: 'patch', patch: { helpOpen: false } })
          ev.preventDefault()
        }
        return
      }

      if (ev.ctrlKey || ev.metaKey || ev.altKey) return

      const key = ev.key
      const prevent = () => ev.preventDefault()

      switch (key) {
        case 'j':
          moveCursor(1)
          prevent()
          break
        case 'k':
          moveCursor(-1)
          prevent()
          break
        case 'h':
          goParent()
          prevent()
          break
        case 'l':
        case 'Enter':
          if (current) void openEntry(current)
          prevent()
          break
        case ' ':
          toggleMark()
          prevent()
          break
        case 'a':
          dispatch({
            type: 'setMarked',
            marked: new Set(entries.map((e) => e.path)),
          })
          prevent()
          break
        case 'u':
        case 'Escape':
          dispatch({ type: 'setMarked', marked: new Set() })
          prevent()
          break
        case 'y':
          yank(false)
          prevent()
          break
        case 'x':
          yank(true)
          prevent()
          break
        case 'p':
          void paste()
          prevent()
          break
        case 'd':
          void deleteSel(false)
          prevent()
          break
        case 'D':
          void deleteSel(true)
          prevent()
          break
        case 'r':
          void refresh()
          prevent()
          break
        case '.':
          void toggleHidden()
          prevent()
          break
        case 's':
          void cycleSort()
          prevent()
          break
        case 'S':
          dispatch({ type: 'patch', patch: { sortDesc: !s.sortDesc } })
          void loadDir(s.cwd, false)
          prevent()
          break
        case 'f':
          openCommand('filter', s.filter)
          prevent()
          break
        case 'g':
          dispatch({ type: 'patch', patch: { cursor: 0 } })
          prevent()
          break
        case 'G':
          dispatch({
            type: 'patch',
            patch: { cursor: Math.max(0, entries.length - 1) },
          })
          prevent()
          break
        case ':':
          openCommand('path')
          prevent()
          break
        case '!':
          openCommand('shell')
          prevent()
          break
        case 'o':
          if (current && !current.isDir) void openPath(current.path)
          prevent()
          break
        case 'n':
          openCommand('mkdir')
          prevent()
          break
        case 'N':
          openCommand('create')
          prevent()
          break
        case 'F2':
          openCommand('rename', current?.name ?? '')
          prevent()
          break
        case 'P': {
          const nextOpen = !s.previewOpen
          dispatch({ type: 'patch', patch: { previewOpen: nextOpen } })
          const ent = visibleEntries(s)[s.cursor]
          if (ent) void loadRightPanel(ent, nextOpen)
          prevent()
          break
        }
        case '?':
          dispatch({ type: 'patch', patch: { helpOpen: true } })
          prevent()
          break
        case 'q':
          quit()
          prevent()
          break
        case 'H':
          historyBack()
          prevent()
          break
        case 'L':
          historyForward()
          prevent()
          break
        case 'm':
          void bookmark('m')
          prevent()
          break
        default:
          if (key >= '1' && key <= '9') {
            if (ev.shiftKey) bookmark(key)
            else goBookmark(key)
            prevent()
          }
          if (key === "'") {
            openCommand('path')
            prevent()
          }
          break
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  })

  return {
    state,
    entries,
    current,
    dispatch,
    runCommand,
    formatSize,
    home: state.config?.startPath ?? '',
  }
}
