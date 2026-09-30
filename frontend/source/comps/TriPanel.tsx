import { useAppState } from "../state/appState"
import { CenterPane } from "./CenterPane"
import { ParentPane } from "./ParentPane"
import { PreviewPane } from "./PreviewPane"

export function TriPanel() {
    const { parentEntries, entries, rightEntries, cwd, cursor, marked } = useAppState()

    return (
        <div style={styles.container}>
            <ParentPane parentEntries={parentEntries} highlightPath={cwd} />
            <CenterPane centerEntries={entries} cursor={cursor} marked={marked} />
            <PreviewPane previewEntries={rightEntries} />
        </div>
    )
}


const styles = {
    container: {
    display: "grid",
    background: "var(--bg)",
    borderBottom: "1px solid var(--border)",
    borderTop: "1px solid var(--border)",
    gridTemplateColumns: "2fr 4fr 3fr",
    minHeight: 0,
  },
}