import { CommandLine } from "./comps/CommandLine"
import { PathBar } from "./comps/PathBar"
import { StatusBar } from "./comps/StatusBar"
import { TriPanel } from "./comps/TriPanel"
import { useKeyInputHandler } from "./hooks/useKeyInput"
import { useListDir } from "./hooks/useListDir"

export function App() {
    useListDir()
    useKeyInputHandler()

    return (
        <section style={styles.container}>
            <PathBar />
            <TriPanel />
            <StatusBar />
            <CommandLine />
        </section>
    )
}

const styles = {
    container: {
    display: "grid",
    gridTemplateRows: "auto 1fr auto auto",
    height: "100%",
    outline: "none",
    background: "var(--bg)",
    },
}