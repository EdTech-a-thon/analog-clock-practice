<script lang="ts">
  import { base, resolve } from '$app/paths';
</script>

<svelte:head>
  <title>About — Clock Literacy</title>
  <meta
    name="description"
    content="Learn about Clock Literacy and the EdTech-a-thon community that built it."
  />
</svelte:head>

<main class="min-h-screen bg-cream px-5 py-6 text-ink sm:px-8">
  <div class="mx-auto max-w-3xl">
    <header class="flex items-center justify-between border-b border-ink/12 pb-4">
      <a href={resolve('/')} class="font-semibold tracking-tight">Clock Literacy</a>
      <a href={resolve('/')} class="text-sm font-semibold text-ink/60 hover:text-ink">
        ← Back home
      </a>
    </header>

    <div class="py-10">
      <h1 class="text-4xl font-semibold tracking-[-0.035em]">About</h1>
      <p class="mt-2 text-ink/60">
        A focused practice tool for students learning to read analog clocks.
      </p>

      <section class="mt-8 rounded-3xl border border-ink/12 bg-white/65 p-6 sm:p-8">
        <div class="flex items-center gap-3">
          <img src={`${base}/logo.svg`} alt="" class="size-11 shrink-0" />
          <h2 class="text-xl font-semibold">From the EdTech-a-thon</h2>
        </div>
        <p class="mt-4 text-sm leading-relaxed text-ink/70">
          Clock Literacy is a project from the
          <a
            href="https://edtechathon.com"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-orange underline-offset-4 hover:underline"
          >EdTech-a-thon</a>, a community of builders making free tools for classrooms. Learn
          more about who we are and what else we're building at
          <a
            href="https://edtechathon.com"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-orange underline-offset-4 hover:underline"
          >edtechathon.com</a>.
        </p>

        <figure
          class="mx-auto mt-7 w-full max-w-xl -rotate-1 rounded-sm bg-white p-3 pb-6 shadow-lg ring-1 ring-ink/10"
        >
          <img
            src={`${base}/2026participants.jpg`}
            alt="Participants of the 2026 EdTech-a-thon"
            class="w-full bg-cream"
          />
          <figcaption class="pt-5 text-center text-lg text-ink/70">EdTech-a-thon 2026</figcaption>
        </figure>
      </section>

      <section class="mt-6 rounded-3xl border border-ink/12 bg-white/65 p-6 sm:p-8">
        <h2 class="text-xl font-semibold">Our promise</h2>
        <ul class="mt-3 space-y-2 text-sm leading-relaxed text-ink/70">
          <li class="font-semibold">Zero paywalls.</li>
          <li class="font-semibold">Zero ads.</li>
          <li class="font-semibold">Zero tracking of personal data.</li>
        </ul>
      </section>

      <section class="mt-6 rounded-3xl border border-ink/12 bg-white/65 p-6 sm:p-8">
        <h2 class="text-xl font-semibold">Feedback & ideas</h2>
        <p class="mt-3 text-sm leading-relaxed text-ink/70">
          We'd love to hear from you. Tell us what's working, what's not, or pitch us an idea
          for a tool you wish existed. We're here to help.
        </p>
        <a
          href="mailto:directors@edtechathon.com?subject=Clock%20Literacy%20feedback"
          class="mt-5 inline-flex min-h-12 items-center rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-orange"
        >
          Email directors@edtechathon.com
        </a>
      </section>
    </div>
  </div>
</main>
