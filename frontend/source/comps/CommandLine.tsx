import { useEffect, useRef } from "preact/hooks"
import { useAppState, useUpdateAppState } from "../state/appState"

export function CommandLine() {
    const { commandOpen, commandValue } = useAppState()
    const update = useUpdateAppState()
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (commandOpen) inputRef.current?.focus()
    }, [commandOpen])

    if (!commandOpen) return null

    return (
        <div style={styles.container}>
            <span>:</span>
            <input
                ref={inputRef}
                class="command-input"
                style={styles.input}
                value={commandValue}
                onInput={(e) => {
                    update({ commandValue: e.currentTarget.value })
                }}
                spellcheck={false}
                autocomplete="off"
            />
        </div>
    )
}

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.35rem 0.75rem",
        borderTop: "1px solid var(--border)",
        whiteSpace: "nowrap",
        overflow: "hidden",
    },
    input: {
        flex: 1,
        minWidth: "0",
        border: "none",
        outline: "none",
        background: "transparent",
        color: "inherit",
        font: "inherit",
    },
}
