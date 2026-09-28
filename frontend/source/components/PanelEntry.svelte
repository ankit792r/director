<script lang="ts">
    import type { Entry } from "../types";

    type PanelEntryProps = {
        entries: Entry[];
        variant: "parent" | "center" | "preview";
        cursor?: number;
        marked?: Set<string>;
        highlightPath?: string;
        emptyLabel?: string;
        listRef?: HTMLUListElement;
    };

    let {
        entries,
        variant,
        cursor = -1,
        marked,
        highlightPath,
        emptyLabel = "empty",
        listRef = $bindable(),
    }: PanelEntryProps = $props();
</script>

<ul class="file-list column-{variant}" bind:this={listRef}>
    {#if entries.length === 0}
        <li class="meta">{emptyLabel}</li>
    {:else}
        {#each entries as ent, i (ent.path)}
            {@const isCursor = variant === "center" && i === cursor}
            {@const isMarked = marked?.has(ent.path) ?? false}
            {@const isParentCurrent =
                variant === "parent" && highlightPath === ent.path}
            <li
                class:cursor={isCursor}
                class:marked={isMarked}
                class:parent-current={isParentCurrent}
            >
                <span class="name" class:dir={ent.isDir} class:file={!ent.isDir}
                    >{ent.name}</span
                >
            </li>
        {/each}
    {/if}
</ul>

<style>
    .file-list {
        overflow: auto;
        margin: 0;
        padding: 0.25rem 0;
        list-style: none;
        flex: 1;
    }

    .file-list li {
        padding: 0.1rem 0.5rem;
        cursor: default;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .file-list li.cursor {
        background: var(--cursor);
        color: #fff;
    }

    .file-list li.marked {
        background: var(--mark);
    }

    .file-list li.cursor.marked {
        outline: 1px solid var(--accent);
    }

    .file-list li.parent-current {
        color: var(--accent);
    }

    .file-list .name.dir {
        color: var(--dir);
    }

    .file-list li.cursor .name.dir,
    .file-list li.cursor .name.file {
        color: inherit;
    }

    .file-list .name.file {
        color: var(--file);
    }

    .file-list .meta {
        color: var(--muted);
    }
</style>
