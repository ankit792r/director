import type { RefObject } from 'preact'
import { Fragment } from 'preact'
import type { Entry } from '../types/fs.ts'
import type { PreviewState } from '../types/fs.ts'

type ColumnProps = {
  entries: Entry[]
  variant: 'parent' | 'center' | 'right'
  cursor?: number
  marked?: Set<string>
  highlightPath?: string
  emptyLabel?: string
  listRef?: RefObject<HTMLUListElement>
}

export function EntryColumn({
  entries,
  variant,
  cursor = -1,
  marked,
  highlightPath,
  emptyLabel = 'empty',
  listRef,
}: ColumnProps) {
  return (
    <ul class={`file-list column-${variant}`} ref={listRef}>
      {entries.length === 0 ? (
        <li class="meta">{emptyLabel}</li>
      ) : (
        entries.map((ent, i) => {
          const isCursor = variant === 'center' && i === cursor
          const isMarked = marked?.has(ent.path)
          const isParentCurrent =
            variant === 'parent' && highlightPath === ent.path
          return (
            <li
              key={ent.path}
              class={[
                isCursor ? 'cursor' : '',
                isMarked ? 'marked' : '',
                isParentCurrent ? 'parent-current' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span class={`name ${ent.isDir ? 'dir' : 'file'}`}>{ent.name}</span>
            </li>
          )
        })
      )}
    </ul>
  )
}

export function RightPreview({
  entries,
  preview,
  isDir,
}: {
  entries: Entry[]
  preview: PreviewState
  isDir: boolean
}) {
  if (isDir) {
    return <EntryColumn entries={entries} variant="right" emptyLabel="empty dir" />
  }
  if (!preview) {
    return <span class="meta">no preview</span>
  }
  if (preview.kind === 'image' && preview.base64) {
    return (
      <img
        alt=""
        class="preview-image"
        src={`data:${preview.mime ?? 'image/png'};base64,${preview.base64}`}
      />
    )
  }
  if (preview.kind === 'text') {
    return (
      <Fragment>
        {preview.text}
        {preview.truncated ? '\n… truncated' : ''}
      </Fragment>
    )
  }
  return <span class="meta">binary or unreadable</span>
}
