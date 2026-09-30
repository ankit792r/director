import type { Entry } from "../types/entry"

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
        <ul style={styles.fileList}>
            {entries.length === 0 ? (
                <li style={styles.meta}>{emptyLabel}</li>
            ) : (
                entries.map((ent, i) => {
                    const isCursor = variant === "center" && i === cursor
                    const isMarked = marked?.has(ent.path) ?? false
                    const isParentCurrent = variant === "parent" && highlightPath === ent.path
                    return (
                        <li key={ent.path} style={rowClass(isCursor, isMarked, isParentCurrent)}>
                            <span style={styles.name}>{ent.name}</span>
                        </li>
                    )
                })
            )}
        </ul>
    )
}

const styles = {
    fileList: {
        overflow: "auto",
        margin: "0",
        padding: "0.25rem 0",
        listStyle: "none",
        flex: 1,
    },
    meta: {
        padding: "0.1rem 0.5rem",
        cursor: "default",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    name: {
        padding: "0.1rem 0.5rem",
    },
    dir: {
        color: "var(--dir)",
    },
    file: {
        color: "var(--file)",
    },
    cursor: {
        background: "var(--cursor)",
        color: "#fff",
    },
    marked: {
        background: "var(--marked)",
        color: "#fff",
    },
    parentCurrent: {
        background: "var(--parentCurrent)",
        color: "#fff",
    },
}