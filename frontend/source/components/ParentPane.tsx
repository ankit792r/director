import type { Entry } from "../types"
import { PanelEntry } from "./PanelEntry"

type ParentPaneProps = {
    parentEntries: Entry[]
    highlightPath?: string
}

export function ParentPane({ parentEntries, highlightPath }: ParentPaneProps) {
    return (
        <section class="parent-pane">
            <PanelEntry entries={parentEntries} variant="parent" highlightPath={highlightPath} />
        </section>
    )
}
