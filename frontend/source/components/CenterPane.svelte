<script lang="ts">
    import type { Entry } from "../types";
    import PanelEntry from "./PanelEntry.svelte";

    let { centerEntries }: { centerEntries: Entry[] } = $props();
</script>


<section class="center-pane">
    <PanelEntry entries={centerEntries} variant="center" />
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