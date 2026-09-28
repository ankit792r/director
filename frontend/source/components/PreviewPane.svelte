<script lang="ts">
    import type { Entry } from "../types";
    import PanelEntry from "./PanelEntry.svelte";

    let preview = $state(false);
    let { previewEntries }: { previewEntries: Entry[] } = $props();
</script>

<section class="preview-pane">
        {#if preview}
        Here is the preview pane
        {:else}
            <PanelEntry entries={previewEntries} variant="preview" />
        {/if}
</section>

<style>
    .preview-pane {
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

</style>