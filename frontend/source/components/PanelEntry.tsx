import type { Entry } from "../types"

type PanelEntryProps = {
    entries: Entry[]
    variant: "parent" | "center" | "preview"
    cursor?: number
    marked?: Set<string>
    highlightPath?: string
    emptyLabel?: string
}

function rowClass(isCursor: boolean, isMarked: boolean, isParentCurrent: boolean) {
    return [isCursor && "cursor", isMarked && "marked", isParentCurrent && "parent-current"]
        .filter(Boolean)
        .join(" ")
}

export function PanelEntry({
    entries,
    variant,
    cursor = -1,
    marked,
    highlightPath,
    emptyLabel = "empty",
}: PanelEntryProps) {
    return (
        <ul class={`file-list column-${variant}`}>
            {entries.length === 0 ? (
                <li class="meta">{emptyLabel}</li>
            ) : (
                entries.map((ent, i) => {
                    const isCursor = variant === "center" && i === cursor
                    const isMarked = marked?.has(ent.path) ?? false
                    const isParentCurrent = variant === "parent" && highlightPath === ent.path
                    return (
                        <li key={ent.path} class={rowClass(isCursor, isMarked, isParentCurrent)}>
                            <span class={`name ${ent.isDir ? "dir" : "file"}`}>{ent.name}</span>
                        </li>
                    )
                })
            )}
        </ul>
    )
}
