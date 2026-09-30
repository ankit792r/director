import type { Entry } from "../types/entry"
import { PanelEntry } from "./PanelEntry"

type CenterPaneProps = {
    centerEntries: Entry[]
    cursor?: number
    marked?: Set<string>
}

export function CenterPane({ centerEntries, cursor = -1, marked }: CenterPaneProps) {
    return (
        <section style={styles.container}>
            <PanelEntry entries={centerEntries} variant="center" cursor={cursor} marked={marked} />
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
        borderRight: "1px solid var(--border)",
        borderLeft: "1px solid var(--border)",
    },
}