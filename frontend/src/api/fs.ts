import { invoke } from '../bridge/director.ts'
import type {
  DirectorConfig,
  Entry,
  ListDirResponse,
  PreviewState,
  SortBy,
} from '../types/fs.ts'

export async function fetchHome(): Promise<string> {
  const { path } = await invoke<{ path: string }>('homeDir')
  return path
}

export async function fetchConfig(): Promise<DirectorConfig> {
  return invoke<DirectorConfig>('getConfig')
}

export async function saveConfig(cfg: DirectorConfig): Promise<void> {
  await invoke('saveConfig', cfg)
}

export async function listDir(
  path: string,
  showHidden: boolean,
  sortBy: SortBy,
  sortDesc: boolean,
): Promise<ListDirResponse> {
  return invoke<ListDirResponse>('listDir', {
    path,
    showHidden,
    sortBy,
    sortDesc,
  })
}

export async function openPath(path: string): Promise<void> {
  await invoke('open', { path })
}

export async function renamePath(path: string, newName: string): Promise<Entry> {
  return invoke<Entry>('rename', { path, newName })
}

export async function mkdirPath(path: string): Promise<Entry> {
  return invoke<Entry>('mkdir', { path })
}

export async function createFilePath(path: string): Promise<Entry> {
  return invoke<Entry>('createFile', { path })
}

export async function transfer(
  sources: string[],
  destDir: string,
  mode: 'copy' | 'move',
) {
  return invoke<{ ok: number; skipped: number; errors?: string[] }>(
    'transfer',
    { sources, destDir, mode },
  )
}

export async function removePaths(paths: string[], permanent: boolean) {
  return invoke<{ ok: number; errors?: string[] }>('remove', {
    paths,
    permanent,
  })
}

export async function readPreview(path: string): Promise<PreviewState> {
  return invoke<PreviewState>('readPreview', { path, maxBytes: 65536 })
}

export async function runShell(dir: string, command: string) {
  return invoke<{ exitCode: number; stdout: string; stderr: string }>(
    'runShell',
    { dir, command },
  )
}
