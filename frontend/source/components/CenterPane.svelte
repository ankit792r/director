<script lang="ts">
    import type { Entry } from "../types";
    import PanelEntry from "./PanelEntry.svelte";

    let { centerEntries, cursor = -1, marked }: { centerEntries: Entry[]; cursor?: number; marked?: Set<string> } = $props();
</script>


<section class="center-pane">
    <PanelEntry entries={centerEntries} variant="center" {cursor} {marked} />
</section>

<style>
    .center-pane {
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--border);
        border-left: 1px solid var(--border);
    }
</style>