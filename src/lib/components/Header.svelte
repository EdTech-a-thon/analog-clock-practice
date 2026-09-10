<script lang="ts">
  import { resolve } from "$app/paths";
  import type { Snippet } from "svelte";

  let { children }: { children?: Snippet } = $props();
</script>

<header class="flex items-center justify-between gap-3 border-b border-ink/12 pb-5">
  <a
    href={resolve("/")}
    class="group flex items-center gap-3 font-semibold tracking-tight"
    aria-label="Clock Literacy home"
  >
    <span
      class="grid size-9 place-items-center rounded-full bg-ink text-cream transition-transform group-hover:-rotate-6"
    >
      <svg viewBox="0 0 24 24" class="size-5" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        />
        <path
          d="M12 7v5l3.5 2"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="1.8"
        />
      </svg>
    </span>
    <span>Clock Literacy</span>
  </a>
  {@render children?.()}
</header>
