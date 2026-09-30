import { useAppState } from "../state"
import { CenterPane } from "./CenterPane"
import { ParentPane } from "./ParentPane"
import { PreviewPane } from "./PreviewPane"

export function TriPanel() {
    const { parentEntries, entries, rightEntries, cwd, cursor, marked } = useAppState()

    return (
        <div class="tri-panel">
            <ParentPane parentEntries={parentEntries} highlightPath={cwd} />
            <CenterPane centerEntries={entries} cursor={cursor} marked={marked} />
            <PreviewPane previewEntries={rightEntries} />
        </div>
    )
}
