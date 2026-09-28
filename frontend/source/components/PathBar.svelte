<script lang="ts">
    import { appState } from "../states/state.svelte";
</script>

<div class="path-bar">
    <span>{appState.cwd || (appState.loading ? "…" : "")}</span>
</div>

<style>

.path-bar {
  padding: 0.35rem 0.75rem;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>