import { Fragment } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { invoke, onDirectorEvent } from './bridge/director.ts'

type PingResult = {
  message: string
  runtime: string
}

export function App() {
  const [ping, setPing] = useState<PingResult | null>(null)
  const [bridgeError, setBridgeError] = useState<string | null>(null)
  const [goEvent, setGoEvent] = useState<string | null>(null)

  useEffect(() => {
    const off = onDirectorEvent('director:ready', (data) => {
      setGoEvent(JSON.stringify(data))
    })

    invoke<PingResult>('ping', { message: 'director' })
      .then((result) => {
        setPing(result)
        setBridgeError(null)
      })
      .catch((err: unknown) => {
        setBridgeError(err instanceof Error ? err.message : String(err))
      })

    return off
  }, [])

  return (
    <Fragment>
      <h1>Director</h1>
      <section>
        <h2>Bridge (phase 0.1)</h2>
        {bridgeError ? (
          <p role="status">JS → Go: error — {bridgeError}</p>
        ) : ping ? (
          <p role="status">
            JS → Go: {ping.message} ({ping.runtime})
          </p>
        ) : (
          <p role="status">JS → Go: calling ping…</p>
        )}
        {goEvent ? (
          <p role="status">Go → JS: {goEvent}</p>
        ) : (
          <p role="status">Go → JS: waiting for director:ready…</p>
        )}
      </section>
    </Fragment>
  )
}
