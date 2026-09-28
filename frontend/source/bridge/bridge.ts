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
        hostInvoke?: DirectorInvoke
        hostEvent?: (event: string, data: unknown) => void
    }
}

const eventListeners = new Map<string, Set<(data: unknown) => void>>()

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
  


/** Call a Go RPC method registered on the bridge. */
export async function invoke<T>(method: string, payload?: unknown): Promise<T> {
    const fn = window.hostInvoke
    if (!fn) {
        throw new Error('hostInvoke is not available (not running in webview?)')
    }
    const payloadJSON =
        payload === undefined ? '{}' : JSON.stringify(payload)
    const reply = await fn(method, payloadJSON)
    if (!reply.ok) {
        throw new Error(reply.error ?? 'invoke failed')
    }
    return reply.data as T
}
