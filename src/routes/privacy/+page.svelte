<script lang="ts">
  import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
  <title>Privacy — Clock Literacy</title>
  <meta name="description" content="What Clock Literacy collects, what it doesn't, and why." />
</svelte:head>

<main class="min-h-screen bg-cream px-5 py-5 text-ink sm:px-8 lg:px-12">
  <div class="mx-auto max-w-7xl">
    <Header />

    <div class="mx-auto max-w-3xl py-10">
      <h1 class="text-4xl font-semibold tracking-[-0.035em]">Privacy</h1>
      <p class="mt-2 text-ink/60">What we collect, what we don't, and why.</p>

      <section class="mt-8 rounded-3xl border border-ink/12 bg-white/65 p-6 sm:p-8">
        <p class="text-sm leading-relaxed text-ink/70">
          Clock Literacy does not collect personal information from visitors or students. We use
          Cloudflare Web Analytics to anonymously count visits, which helps us understand how
          Clock Literacy is being used in classrooms. Cloudflare Web Analytics is cookieless,
          does not fingerprint visitors, and does not track users across other sites. See
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-orange underline-offset-4 hover:underline"
          >Cloudflare's privacy policy</a>
          for details. We do not share, sell, or otherwise transfer any visitor data to third
          parties. Clock Literacy stores practice progress and the name entered for a Practice
          Report in your browser's local storage, and that information never leaves your device.
        </p>
        <p class="mt-5 text-sm leading-relaxed text-ink/70">
          Questions or concerns? Email
          <a
            href="mailto:support@teacher.dev?subject=Clock%20Literacy%20privacy"
            class="font-semibold text-orange underline-offset-4 hover:underline"
          >support@teacher.dev</a>.
        </p>
      </section>
    </div>
  </div>
</main>
