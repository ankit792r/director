import { useEffect, useRef } from "preact/hooks"
import { useAppState, useUpdateAppState } from "../state/appState"

function typingCommand(event: KeyboardEvent) {
    return event.target instanceof HTMLInputElement && event.target.classList.contains("command-input")
}

export function useKeyInputHandler() {
    const { commandOpen } = useAppState()
    const update = useUpdateAppState()
    const commandOpenRef = useRef(commandOpen)
    commandOpenRef.current = commandOpen

    useEffect(() => {
        function handleKeydown(event: KeyboardEvent) {
            if (event.repeat) return

            if (event.key === ":" && !typingCommand(event)) {
                event.preventDefault()
                update({ commandValue: "", commandOpen: true })
                return
            }

            if (typingCommand(event) && event.key !== "Escape") return

            if (commandOpenRef.current) {
                update({ commandOpen: false })
            }
        }

        window.addEventListener("keydown", handleKeydown)
        return () => window.removeEventListener("keydown", handleKeydown)
    }, [update])
}
