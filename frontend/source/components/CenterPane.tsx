import type { Entry } from "../types"
import { PanelEntry } from "./PanelEntry"

type CenterPaneProps = {
    centerEntries: Entry[]
    cursor?: number
    marked?: Set<string>
}

export function CenterPane({ centerEntries, cursor = -1, marked }: CenterPaneProps) {
    return (
        <section class="center-pane">
            <PanelEntry entries={centerEntries} variant="center" cursor={cursor} marked={marked} />
        </section>
    )
}
