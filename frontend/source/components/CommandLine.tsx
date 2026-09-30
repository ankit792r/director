import { useEffect, useRef } from "preact/hooks"
import { appState, notifyAppState, useAppState } from "../state"

export function CommandLine() {
    const { commandOpen, commandValue } = useAppState()
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (commandOpen) inputRef.current?.focus()
    }, [commandOpen])

    if (!commandOpen) return null

    return (
        <div class="command-line">
            <span>:</span>
            <input
                ref={inputRef}
                class="command-input"
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
