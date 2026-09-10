<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import ClockFace from '$lib/components/ClockFace.svelte';
  import { formatTime } from '$lib/domain/time';
  import type { Direction, Level } from '$lib/domain/types';
  import {
    latestRound,
    loadName,
    markPrinted,
    saveName,
    score,
    unprintedPreviousRound,
    type CompletedRound
  } from '$lib/storage';

  /** Six misses is what fits on one page alongside the header. */
  const MAX_SHOWN = 6;

  const levelNames = { easy: 'Easy', medium: 'Medium', hard: 'Hard' } as const;

  let current = $state<CompletedRound | null>(null);
  let earlier = $state<CompletedRound | null>(null);
  let showing = $state<'current' | 'earlier'>('current');
  let name = $state('');
  let loaded = $state(false);

  onMount(() => {
    current = latestRound();
    earlier = unprintedPreviousRound();
    name = loadName();
    loaded = true;
  });

  const round = $derived(showing === 'earlier' ? earlier : current);
  const correctAnswers = $derived((round?.answers ?? []).filter((answer) => answer.correct));
  const misses = $derived((round?.answers ?? []).filter((answer) => !answer.correct));
  const shown = $derived(misses.slice(0, MAX_SHOWN));

  function answerFormat(level: Level, direction: Direction): string {
    if (direction === 'time-to-clock') return 'Multiple choice (clock)';
    return level === 'hard' ? 'Typed input' : 'Multiple choice (time)';
  }

  const finishedOn = $derived(
    round
      ? new Date(round.finishedAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : ''
  );

  function print(): void {
    if (!round) return;
    const printed = round.finishedAt;
    saveName(name.trim());
    // Mark only once the dialog has actually been raised and dismissed. Marking
    // beforehand meant a cancelled print silently burned the one chance the
    // student had to recover an earlier Round.
    const onAfterPrint = () => {
      markPrinted(printed);
      window.removeEventListener("afterprint", onAfterPrint);
    };
    window.addEventListener("afterprint", onAfterPrint);
    window.print();
  }
</script>

<svelte:head>
  <title>Practice report — Clock Literacy</title>
</svelte:head>

<main class="min-h-screen bg-cream px-5 py-8 text-ink sm:px-8 print:bg-white print:p-0">
  <div class="mx-auto max-w-3xl">
    <div class="no-print mb-6 flex items-center justify-between border-b border-ink/12 pb-4">
      <a href={resolve('/')} class="font-semibold tracking-tight">Clock Literacy</a>
      <a href={resolve('/practice')} class="text-sm font-semibold text-ink/60 hover:text-ink">
        Back to practice
      </a>
    </div>

    {#if !loaded}
      <p class="text-ink/60">Loading your round…</p>
    {:else if !round}
      <h1 class="text-3xl font-semibold tracking-tight">Nothing to report yet</h1>
      <p class="mt-3 text-lg text-ink/70">
        Finish a round of practice and it will show up here, ready to print.
      </p>
      <a
        href={resolve('/practice')}
        class="mt-7 inline-flex min-h-14 items-center rounded-full bg-orange px-7 py-4
               text-base font-bold text-white"
      >
        Start practicing
      </a>
    {:else}
      <div class="no-print mb-7 rounded-3xl border-2 border-ink/15 bg-white p-5">
        <label class="block text-sm font-bold tracking-wide text-ink/60" for="student-name">
          Your name
        </label>
        <input
          id="student-name"
          class="mt-2 w-full rounded-2xl border-2 border-ink/20 px-4 py-3 text-xl font-semibold
                 focus:border-orange focus:outline-none"
          type="text"
          autocomplete="name"
          placeholder="Type your name"
          bind:value={name}
        />
        <p class="mt-2 text-sm text-ink/55">
          Check this is you — this device may have been used by someone else.
        </p>

        {#if earlier}
          <div class="mt-5 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
            <button
              type="button"
              class="min-h-12 rounded-full border-2 px-5 text-sm font-bold transition
                     {showing === 'current' ? 'border-ink bg-ink text-white' : 'border-ink/20'}"
              onclick={() => (showing = 'current')}
            >
              This round
            </button>
            <button
              type="button"
              class="min-h-12 rounded-full border-2 px-5 text-sm font-bold transition
                     {showing === 'earlier' ? 'border-ink bg-ink text-white' : 'border-ink/20'}"
              onclick={() => (showing = 'earlier')}
            >
              Your last round ({levelNames[earlier.level]}, {score(earlier)}/{earlier.answers
                .length})
            </button>
          </div>
        {/if}

        <button
          type="button"
          class="mt-5 min-h-14 rounded-full bg-orange px-7 py-4 text-base font-bold text-white
                 transition hover:-translate-y-0.5"
          onclick={print}
        >
          Print / Save as PDF
        </button>
      </div>

      <article class="rounded-3xl border-2 border-ink/15 bg-white p-7 print:rounded-none
                      print:border-0 print:p-0">
        <header class="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <p class="text-xs font-bold tracking-[0.2em] text-ink/50 uppercase">
              Clock Literacy · Practice report
            </p>
            <h1 class="mt-1 text-3xl font-semibold tracking-tight">
              {name.trim() || 'Name: ________________'}
            </h1>
          </div>
          <p class="text-right text-sm font-semibold text-ink/70">
            {finishedOn}<br />
            {levelNames[round.level]} · {round.answers.length} questions
          </p>
        </header>

        <p class="mt-6 text-5xl font-semibold tabular-nums">
          {score(round)} <span class="text-ink/45">out of {round.answers.length}</span>
        </p>

        {#if correctAnswers.length > 0}
          <section class="mt-6 break-inside-avoid">
            <h2 class="text-base font-bold tracking-wide">Questions answered correctly</h2>
            <ul class="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 print:grid-cols-2">
              {#each correctAnswers as answer (answer.time.hour + ':' + answer.time.minute)}
                <li>
                  <span class="font-bold tabular-nums">{formatTime(answer.time)}</span>
                  <span class="text-ink/70">— {answerFormat(round.level, answer.direction)}</span>
                </li>
              {/each}
            </ul>
          </section>
        {/if}

        {#if shown.length > 0}
          <h2 class="mt-8 text-base font-bold tracking-wide">Questions to look at again</h2>
          <div class="mt-4 grid grid-cols-3 gap-6">
            {#each shown as miss (miss.time.hour + ':' + miss.time.minute)}
              <div>
                <ClockFace time={miss.time} plain />
                <p class="mt-2 text-center text-sm font-bold tabular-nums">
                  {formatTime(miss.time)}
                </p>
                <p class="text-center text-xs text-ink/70">
                  {answerFormat(round.level, miss.direction)}
                </p>
                {#if miss.answer}
                  <p class="text-center text-xs text-ink/60 tabular-nums">
                    answered {formatTime(miss.answer)}
                  </p>
                {/if}
              </div>
            {/each}
          </div>
          {#if misses.length > shown.length}
            <p class="mt-4 text-sm text-ink/60">
              and {misses.length - shown.length} more
            </p>
          {/if}
        {:else}
          <p class="mt-6 text-lg">Every question correct.</p>
        {/if}
      </article>
    {/if}
  </div>
</main>

<style>
  @media print {
    :global(.no-print) {
      display: none !important;
    }
    @page {
      margin: 16mm;
    }
  }
</style>
