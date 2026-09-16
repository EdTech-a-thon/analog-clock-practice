import adapter from "@sveltejs/adapter-vercel";

export default {
  kit: {
    adapter: adapter(),

    /**
     * Prerendering has no incoming request to read an origin from, so without
     * this SvelteKit bakes its `http://sveltekit-prerender` placeholder into
     * the canonical and og:image URLs in `Seo.svelte` and link unfurling
     * breaks. Preview deployments therefore advertise the production URLs,
     * which is what we want anyway: previews should not compete with
     * production in search results.
     */
    prerender: { origin: "https://www.clockliteracy.com" },
  },
};
