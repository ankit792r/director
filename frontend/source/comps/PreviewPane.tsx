import type { Entry } from "../types/entry"
import { PanelEntry } from "./PanelEntry"

type PreviewPaneProps = {
    previewEntries: Entry[]
}

export function PreviewPane({ previewEntries }: PreviewPaneProps) {
    return (
        <section style={styles.container}>
            <PanelEntry entries={previewEntries} variant="preview" />
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