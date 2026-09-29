import { appState } from "../states/state.svelte";

export function useKeyInputHandler() {

    function handleKeydown(event: KeyboardEvent) {
        if (event.repeat) return;

        // TODO: properly handle key down events with switch statement and update the state

        function typingCommand(event: KeyboardEvent) {
            return event.target instanceof HTMLInputElement && event.target.classList.contains("command-input");
        }

        if (event.key === ":" && !typingCommand(event)) {
            event.preventDefault();
            appState.commandValue = "";
            appState.commandOpen = true;
            return;
        }

        if (typingCommand(event) && event.key !== "Escape") return;

        appState.commandOpen = false;
    }

    return { handleKeydown };
}