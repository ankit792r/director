type InvokeReply = {
  ok: boolean
  data?: unknown
  error?: string
}

export type DirectorInvoke = (
  method: string,
  payloadJSON: string,
) => Promise<InvokeReply>

declare global {
  interface Window {
    directorInvoke?: DirectorInvoke
    __directorOnEvent?: (event: string, data: unknown) => void
  }
}

const eventListeners = new Map<string, Set<(data: unknown) => void>>()

window.__directorOnEvent = (event: string, data: unknown) => {
  eventListeners.get(event)?.forEach((listener) => listener(data))
}

/** Subscribe to events pushed from Go via Bridge.Emit. */
export function onDirectorEvent(
  event: string,
  listener: (data: unknown) => void,
): () => void {
  let set = eventListeners.get(event)
  if (!set) {
    set = new Set()
    eventListeners.set(event, set)
  }
  set.add(listener)
  return () => {
    set!.delete(listener)
  }
}

function installDevMock() {
  if (typeof window.directorInvoke === 'function') {
    return
  }
  window.directorInvoke = async (method, _payloadJSON) => {
    if (method === 'ping') {
      const result = { message: 'pong (dev mock)', runtime: 'browser' }
      return { ok: true, data: result }
    }
    if (method === 'homeDir') {
      return { ok: true, data: { path: '/home/dev' } }
    }
    if (method === 'getConfig') {
      return {
        ok: true,
        data: {
          showHidden: false,
          sortBy: 'name',
          sortDesc: false,
          bookmarks: {},
          keymapHints: true,
        },
      }
    }
    if (method === 'listDir') {
      return {
        ok: true,
        data: {
          path: '/home/dev',
          parent: '/home',
          entries: [
            {
              name: 'README-dev-mock.txt',
              path: '/home/dev/README-dev-mock.txt',
              isDir: false,
              size: 12,
              modTime: 0,
              mode: '-rw-r--r--',
            },
          ],
        },
      }
    }
    if (method === 'readPreview') {
      return {
        ok: true,
        data: {
          path: '/home/dev/README-dev-mock.txt',
          kind: 'text',
          text: 'Dev mock UI — run DIRECTOR_DEV=1 with Go for real FS.',
        },
      }
    }
    if (method === 'quit') {
      return { ok: true, data: { ok: true } }
    }
    return { ok: false, error: `unknown method: ${method} (dev mock)` }
  }
}

if (import.meta.env.DEV) {
  installDevMock()
}

/** Call a Go RPC method registered on the bridge. */
export async function invoke<T>(method: string, payload?: unknown): Promise<T> {
  const fn = window.directorInvoke
  if (!fn) {
    throw new Error('directorInvoke is not available (not running in webview?)')
  }
  const payloadJSON =
    payload === undefined ? '{}' : JSON.stringify(payload)
  const reply = await fn(method, payloadJSON)
  if (!reply.ok) {
    throw new Error(reply.error ?? 'invoke failed')
  }
  return reply.data as T
}
