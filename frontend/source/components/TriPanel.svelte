<script lang="ts">
    import type { Entry } from "../types";
    import PreviewPane from "./PreviewPane.svelte";
    import ParentPane from "./ParentPane.svelte";
    import CenterPane from "./CenterPane.svelte";

    import { appState } from "../states/state.svelte";

    let parentEntries: Entry[] = $derived(appState.parentEntries);
    let centerEntries: Entry[] = $derived(appState.entries);
    let previewEntries: Entry[] = $derived(appState.rightEntries);
</script>

<div class="tri-panel">
    <ParentPane {parentEntries} />
    <CenterPane {centerEntries} />
    <PreviewPane {previewEntries} />
</div>

<style>
    .tri-panel {
        display: grid;
        grid-template-columns: 2fr 4fr 3fr;
        min-height: 0;
    }
</style>
