import { Fragment } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { useDirector } from './app/useDirector.ts'
import { shortenPath } from './app/state.ts'
import { HELP_LINES } from './keymap/help.ts'

export function App() {
  const { state, entries, current, dispatch, runCommand, formatSize } =
    useDirector()
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

  return (
    <div class="director" tabIndex={0}>
      <div class="path-bar">{shortenPath(state.cwd, home) || '…'}</div>

      <div class={`main ${state.previewOpen ? '' : 'preview-off'}`}>
        <ul class="file-list" ref={listRef}>
          {state.loading && entries.length === 0 ? (
            <li class="meta">loading…</li>
          ) : entries.length === 0 ? (
            <li class="meta">empty</li>
          ) : (
            entries.map((ent, i) => (
              <li
                key={ent.path}
                class={`${i === state.cursor ? 'cursor' : ''} ${state.marked.has(ent.path) ? 'marked' : ''}`}
              >
                <span class={`name ${ent.isDir ? 'dir' : ''}`}>
                  {ent.name}
                  {ent.linkTarget ? ` → ${ent.linkTarget}` : ''}
                </span>
                <span class="meta">{ent.isDir ? 'dir' : formatSize(ent.size)}</span>
                <span class="meta">{ent.mode}</span>
              </li>
            ))
          )}
        </ul>

        {state.previewOpen && (
          <div class="preview">
            {!current ? (
              <span class="meta">no selection</span>
            ) : state.preview?.kind === 'image' && state.preview.base64 ? (
              <img
                alt=""
                src={`data:${state.preview.mime ?? 'image/png'};base64,${state.preview.base64}`}
              />
            ) : state.preview?.kind === 'text' ? (
              <Fragment>
                {state.preview.text}
                {state.preview.truncated ? '\n… truncated' : ''}
              </Fragment>
            ) : state.preview?.kind === 'directory' ? (
              'directory'
            ) : (
              <span class="meta">binary or unreadable</span>
            )}
          </div>
        )}
      </div>

      {state.config?.keymapHints !== false && (
        <div class="hint">? help · j/k move · y/x/p · d trash · : path · q quit</div>
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
        {state.error ??
          state.status ??
          (state.marked.size
            ? `${state.marked.size} marked`
            : current?.name ?? '')}
        {state.clipboard
          ? ` · ${state.clipboard.mode} ${state.clipboard.paths.length}`
          : ''}
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
