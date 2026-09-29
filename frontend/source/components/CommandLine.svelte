<script lang="ts">
    import { tick } from "svelte";
    import { appState } from "../states/state.svelte";

    let inputEl = $state<HTMLInputElement | null>(null);

    $effect(() => {
        if (!appState.commandOpen) return;
        void tick().then(() => inputEl?.focus());
    });

</script>


{#if appState.commandOpen}
    <div class="command-line">
        <span>:</span>
        <input
            class="command-input"
            bind:this={inputEl}
            bind:value={appState.commandValue}
            spellcheck="false"
            autocomplete="off"
        />
    </div>
{/if}

<style>
    .command-line {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.35rem 0.75rem;
        background: var(--panel);
        border-top: 1px solid var(--border);
        white-space: nowrap;
        overflow: hidden;
    }

    .command-input {
        flex: 1;
        min-width: 0;
        border: none;
        outline: none;
        background: transparent;
        color: inherit;
        font: inherit;
    }
</style>
