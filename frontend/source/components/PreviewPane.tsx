import type { Entry } from "../types"
import { PanelEntry } from "./PanelEntry"

type PreviewPaneProps = {
    previewEntries: Entry[]
}

export function PreviewPane({ previewEntries }: PreviewPaneProps) {
    return (
        <section class="preview-pane">
            <PanelEntry entries={previewEntries} variant="preview" />
        </section>
    )
}
