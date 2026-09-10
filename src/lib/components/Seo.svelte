<script lang="ts">
  import { page } from "$app/state";
  import { base } from "$app/paths";

  type Props = { title: string; description?: string };

  let { title, description }: Props = $props();

  /**
   * Absolute URLs, built from the request origin so the same code works on
   * localhost, previews, and production. Link unfurlers (Instagram, iMessage,
   * Slack) reject relative og:image paths, and without an og:image they fall
   * back to whatever <img> they find on the page — here, the EdTech-a-thon
   * logo in the footer.
   */
  const canonical = $derived(new URL(page.url.pathname, page.url.origin).href);
  const image = $derived(new URL(`${base}/og-image.png`, page.url.origin).href);
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
  {/if}
  <link rel="canonical" href={canonical} />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Clock Literacy" />
  <meta property="og:title" content={title} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={image} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta
    property="og:image:alt"
    content="Clock Literacy: practice reading an analog clock, beside a clock face showing ten past ten."
  />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  {#if description}
    <meta name="twitter:description" content={description} />
  {/if}
  <meta name="twitter:image" content={image} />
</svelte:head>
