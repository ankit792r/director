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
  window.directorInvoke = async (method, payloadJSON) => {
    if (method === 'ping') {
      let message = ''
      try {
        const body = JSON.parse(payloadJSON || '{}') as { message?: string }
        message = body.message ?? ''
      } catch {
        /* ignore */
      }
      const result = {
        message: message ? `pong: ${message} (dev mock)` : 'pong (dev mock)',
        runtime: 'browser',
      }
      queueMicrotask(() => {
        window.__directorOnEvent?.('director:ready', result)
      })
      return { ok: true, data: result }
    }
    return { ok: false, error: `unknown method: ${method}` }
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
