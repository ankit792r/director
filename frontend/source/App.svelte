<script lang="ts">
  import PathBar from "./components/PathBar.svelte";
  import StatusBar from "./components/StatusBar.svelte";
  import CommandLine from "./components/CommandLine.svelte";
  import TriPanel from "./components/TriPanel.svelte";
  import { useListDir } from "./hooks/useListDir.svelte";

  useListDir();
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
