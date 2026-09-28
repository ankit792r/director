<script lang="ts">
    import type { Entry } from "../types";
    import PanelEntry from "./PanelEntry.svelte";

    let { parentEntries, highlightPath }: { parentEntries: Entry[]; highlightPath?: string } = $props();
</script>

<section class="parent-pane">
    <PanelEntry entries={parentEntries} variant="parent" {highlightPath} />
</section>

<style>
    .parent-pane {
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
</style>
