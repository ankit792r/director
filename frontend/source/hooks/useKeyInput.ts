import { useEffect } from "preact/hooks"
import { appState, notifyAppState } from "../state/appState"

function typingCommand(event: KeyboardEvent) {
    return event.target instanceof HTMLInputElement && event.target.classList.contains("command-input")
}

export function useKeyInputHandler() {
    useEffect(() => {
        function handleKeydown(event: KeyboardEvent) {
            if (event.repeat) return

            if (event.key === ":" && !typingCommand(event)) {
                event.preventDefault()
                appState.commandValue = ""
                appState.commandOpen = true
                notifyAppState()
                return
            }

            if (typingCommand(event) && event.key !== "Escape") return

            if (appState.commandOpen) {
                appState.commandOpen = false
                notifyAppState()
            }
        }

        window.addEventListener("keydown", handleKeydown)
        return () => window.removeEventListener("keydown", handleKeydown)
    }, [])
}
