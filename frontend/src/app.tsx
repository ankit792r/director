import { useEffect, useRef } from 'preact/hooks'
import type { RefObject } from 'preact'
import { useDirector } from './app/useDirector.ts'
import { shortenPath } from './app/state.ts'
import { HELP_LINES } from './keymap/help.ts'
import { EntryColumn, RightPreview } from './components/Panels.tsx'

export function App() {
  const { state, entries, current, dispatch, runCommand } = useDirector()
  const listRef = useRef<HTMLUListElement>(null)
  const cmdRef = useRef<HTMLInputElement>(null)
  const home = state.home

  useEffect(() => {
    if (state.commandOpen) cmdRef.current?.focus()
  }, [state.commandOpen])

  useEffect(() => {
    const el = listRef.current?.querySelector('li.cursor')
    el?.scrollIntoView({ block: 'nearest' })
  }, [state.cursor, state.cwd, state.filter])

  const commandLabel =
    state.commandMode === 'path'
      ? ':'
      : state.commandMode === 'shell'
        ? '!'
        : state.commandMode === 'rename'
          ? 'rename'
          : state.commandMode === 'mkdir'
            ? 'mkdir'
            : state.commandMode === 'create'
              ? 'new file'
              : 'filter'

  const pos =
    entries.length > 0 ? `${state.cursor + 1}/${entries.length}` : '0/0'

  return (
    <div class="director" tabIndex={0}>
      <div class="path-bar">{shortenPath(state.cwd, home) || '~'}</div>

      <div
        class={`tri-pane ${state.previewOpen ? '' : 'no-preview'}`}
      >
        <section class="pane pane-parent" aria-label="Parent directory">
          <EntryColumn
            entries={state.parentEntries}
            variant="parent"
            highlightPath={state.cwd}
            emptyLabel={state.parent ? '…' : '·'}
          />
        </section>

        <section class="pane pane-center" aria-label="Current directory">
          {state.loading && entries.length === 0 ? (
            <ul class="file-list column-center">
              <li class="meta">loading…</li>
            </ul>
          ) : (
            <EntryColumn
              entries={entries}
              variant="center"
              cursor={state.cursor}
              marked={state.marked}
              listRef={listRef as RefObject<HTMLUListElement>}
            />
          )}
        </section>

        {state.previewOpen && (
          <section class="pane pane-preview" aria-label="Preview">
            <div class="preview-body">
              <RightPreview
                entries={state.rightEntries}
                preview={state.preview}
                isDir={state.rightIsDir}
              />
            </div>
          </section>
        )}
      </div>

      {state.config?.keymapHints !== false && (
        <div class="hint">? help · h parent · l enter · y/x/p · q quit</div>
      )}

      {state.commandOpen && (
        <div class="command-line">
          <span>{commandLabel}</span>
          <input
            ref={cmdRef}
            value={state.commandValue}
            onInput={(e) =>
              dispatch({
                type: 'patch',
                patch: { commandValue: (e.target as HTMLInputElement).value },
              })
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void runCommand()
                e.preventDefault()
              }
            }}
          />
        </div>
      )}

      <div class={`status-bar ${state.error ? 'error' : ''}`}>
        <span class="status-left">
          {state.error ? (
            state.error
          ) : (
            <>
              <span class="tag">NOR</span>
              {current?.name ?? '—'}
            </>
          )}
        </span>
        <span class="status-right">
          {current?.mode ?? ''}
          {current ? ` · ${pos}` : ''}
          {state.clipboard
            ? ` · ${state.clipboard.mode} ${state.clipboard.paths.length}`
            : ''}
          {state.status ? ` · ${state.status}` : ''}
        </span>
      </div>

      {state.helpOpen && (
        <div
          class="help-overlay"
          onClick={() => dispatch({ type: 'patch', patch: { helpOpen: false } })}
        >
          <div class="help-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Director keys</h2>
            <pre>{HELP_LINES.join('\n')}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
