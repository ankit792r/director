<script lang="ts">
  import { onMount } from "svelte";
  import PathBar from "./components/PathBar.svelte";
  import StatusBar from "./components/StatusBar.svelte";
  import CommandLine from "./components/CommandLine.svelte";
  import TriPanel from "./components/TriPanel.svelte";
  import { appState } from "./states/state.svelte";
  import { openDir } from "./states/openDir";

  onMount(() => {
    const start = appState.config?.startPath || appState.home || "~";
    void openDir(start);
  });
</script>

<section class="director">
  <PathBar />
  <TriPanel />
  <StatusBar />
  <CommandLine />
</section>

<style>
  .director {
    display: grid;
    grid-template-rows: auto 1fr auto auto;
    height: 100%;
    outline: none;
  }
</style>
