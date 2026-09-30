import { useEffect, useRef } from "preact/hooks"
import { appState, notifyAppState, useAppState } from "../state/appState"

export function CommandLine() {
    const { commandOpen, commandValue } = useAppState()
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
                style={styles.input}
                value={commandValue}
                onInput={(e) => {
                    appState.commandValue = e.currentTarget.value
                    notifyAppState()
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
        background: "var(--bg)",
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