import "./app.css"
import { CommandLine } from "./components/CommandLine"
import { PathBar } from "./components/PathBar"
import { StatusBar } from "./components/StatusBar"
import { TriPanel } from "./components/TriPanel"
import { useKeyInputHandler } from "./hooks/useKeyInput"
import { useListDir } from "./hooks/useListDir"

export function App() {
    useListDir()
    useKeyInputHandler()

    return (
        <section class="director">
            <PathBar />
            <TriPanel />
            <StatusBar />
            <CommandLine />
        </section>
    )
}
