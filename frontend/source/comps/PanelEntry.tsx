import type { CSSProperties } from "preact"
import type { Entry } from "../types/entry"

type PanelEntryProps = {
    entries: Entry[]
    variant: "parent" | "center" | "preview"
    cursor?: number
    marked?: Set<string>
    highlightPath?: string
    emptyLabel?: string
}

function rowStyle(isCursor: boolean, isMarked: boolean, isParentCurrent: boolean): CSSProperties {
    return {
        ...styles.row,
        ...(isCursor ? styles.cursorRow : {}),
        ...(isMarked ? styles.markedRow : {}),
        ...(isParentCurrent ? styles.parentCurrentRow : {}),
    }
}

function nameStyle(isDir: boolean, isCursor: boolean): CSSProperties {
    if (isCursor) return styles.nameOnCursor
    return isDir ? styles.nameDir : styles.nameFile
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
                        <li key={ent.path} style={rowStyle(isCursor, isMarked, isParentCurrent)}>
                            <span style={nameStyle(ent.isDir, isCursor)}>{ent.name}</span>
                        </li>
                    )
                })
            )}
        </ul>
    )
}

const styles: Record<string, CSSProperties> = {
    fileList: {
        overflow: "auto",
        margin: "0",
        padding: "0",
        listStyle: "none",
        flex: 1,
    },
    row: {
        padding: "0.1rem 0.5rem",
        cursor: "default",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    meta: {
        padding: "0.1rem 0.5rem",
        color: "var(--muted)",
    },
    nameDir: {
        color: "var(--dir)",
    },
    nameFile: {
        color: "var(--file)",
    },
    nameOnCursor: {
        color: "inherit",
    },
    cursorRow: {
        background: "var(--cursor)",
        color: "#fff",
    },
    markedRow: {
        background: "var(--mark)",
    },
    parentCurrentRow: {
        color: "var(--accent)",
    },
}
