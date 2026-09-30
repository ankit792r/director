import type { Entry } from "../types/entry"
import { PanelEntry } from "./PanelEntry"

type ParentPaneProps = {
    parentEntries: Entry[]
    highlightPath?: string
}

export function ParentPane({ parentEntries, highlightPath }: ParentPaneProps) {
    return (
        <section style={styles.container}>
            <PanelEntry entries={parentEntries} variant="parent" highlightPath={highlightPath} />
        </section>
    )
}

const styles = {
    container: {
        minWidth: "0",
        minHeight: "0",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
}