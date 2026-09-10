<script lang="ts">
  import { tick } from 'svelte';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import Header from '$lib/components/Header.svelte';
  import ClockFace from '$lib/components/ClockFace.svelte';
  import TimeInput from '$lib/components/TimeInput.svelte';
  import { buildRound, type RoundLength } from '$lib/domain/round';
  import { classify, explain } from '$lib/domain/feedback';
  import { formatTime, sameTime } from '$lib/domain/time';
  import type { ClockTime, DistractorKind, Level, Option, Round } from '$lib/domain/types';
  import {
    saveRound,
    unprintedPreviousRound,
    type AnsweredQuestion,
    type CompletedRound
  } from '$lib/storage';

  type Phase = 'setup' | 'asking' | 'checking' | 'results';

  const levels: { id: Level; name: string; blurb: string }[] = [
    {
      id: 'easy',
      name: 'Easy',
      blurb: 'Questions and answers use times ending in :00, :15, :30, or :45, like 2:00 and 2:15.'
    },
    {
      id: 'medium',
      name: 'Medium',
      blurb: 'Questions and answers use times in 5-minute steps, like 2:05, 2:10, and 2:15.'
    },
    {
      id: 'hard',
      name: 'Hard',
      blurb: 'Questions and answers can use any minute, like 2:07 or 2:43.'
    }
  ];
  const lengths: RoundLength[] = [5, 10, 20];

  const requested = page.url.searchParams.get('level');
  const preset = levels.find((level) => level.id === requested)?.id;

  let phase = $state<Phase>('setup');
  let level = $state<Level>(preset ?? 'easy');
  let length = $state<RoundLength>(10);

  let round = $state<Round | null>(null);
  let index = $state(0);
  let answers = $state<AnsweredQuestion[]>([]);

  let picked = $state<ClockTime | null>(null);
  let wrongKind = $state<DistractorKind | null>(null);
  let typedHour = $state('');
  let typedMinute = $state('');
  let advanceTimer: ReturnType<typeof setTimeout> | null = null;
  let inputProblem = $state<string | null>(null);

  let previous = $state<CompletedRound | null>(null);

  $effect(() => () => {
    if (advanceTimer) clearTimeout(advanceTimer);
  });

  const question = $derived(round?.questions[index] ?? null);
  const wasCorrect = $derived(picked !== null && question !== null && sameTime(picked, question.time));
  const rightSoFar = $derived(answers.filter((answer) => answer.correct).length);
  const missed = $derived(answers.filter((answer) => !answer.correct));

  /** Point at the hand the student misread. */
  function annotationFor(kind: DistractorKind | null): 'hour' | 'minute' {
    return kind === 'hour-slip' || kind === 'swapped-hands' ? 'hour' : 'minute';
  }

  function start(): void {
    round = buildRound(level, length, () => Math.random());
    index = 0;
    answers = [];
    resetQuestion();
    phase = 'asking';
  }

  function resetQuestion(): void {
    picked = null;
    wrongKind = null;
    typedHour = '';
    typedMinute = '';
    inputProblem = null;
  }

  function record(answer: ClockTime): void {
    if (!question) return;
    const correct = sameTime(answer, question.time);
    picked = answer;
    wrongKind = correct ? null : classify(answer, question.time, level);
    answers = [
      ...answers,
      {
        time: question.time,
        direction: question.direction,
        answer,
        correct
      }
    ];
    phase = 'checking';

    // Right answers keep the Round moving; wrong ones wait, so nobody skips
    // past the explanation without reading it.
    if (correct) {
      advanceTimer = setTimeout(advance, 1100);
      return;
    }
    tick().then(() => {
      // The pressed option is now disabled, so focus would otherwise be lost.
      document.querySelector<HTMLButtonElement>('[data-continue]')?.focus({ preventScroll: true });
    });
  }

  function chooseOption(option: Option): void {
    if (phase !== 'asking') return;
    record(option.time);
    if (option.kind !== 'correct') wrongKind = option.kind;
  }

  function submitTyped(): void {
    if (phase !== 'asking') return;
    const hour = Number(typedHour.trim());
    const minute = Number(typedMinute.trim());

    // Say what is wrong rather than doing nothing: a Check button that appears
    // broken teaches the student that they broke it.
    if (!Number.isInteger(hour) || hour < 1 || hour > 12) {
      inputProblem = 'The hour needs to be a number from 1 to 12.';
      return;
    }
    if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
      inputProblem = 'The minutes need to be a number from 0 to 59.';
      return;
    }
    inputProblem = null;
    record({ hour, minute });
  }

  function advance(): void {
    if (advanceTimer) {
      clearTimeout(advanceTimer);
      advanceTimer = null;
    }
    if (!round) return;
    if (index + 1 >= round.questions.length) {
      finish();
      return;
    }
    index += 1;
    resetQuestion();
    phase = 'asking';
  }

  function finish(): void {
    if (!round) return;
    saveRound({
      level: round.level,
      finishedAt: new Date().toISOString(),
      answers,
      printed: false
    });
    previous = unprintedPreviousRound();
    phase = 'results';
  }

  const optionLabel = (option: Option) => formatTime(option.time);
</script>

<svelte:head>
  <title>Practice — Clock Literacy</title>
</svelte:head>

<main class="min-h-screen bg-cream px-5 py-5 text-ink sm:px-8 lg:px-12">
  <div class="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl flex-col">
    <Header>
      {#if phase === 'asking' || phase === 'checking'}
        <p class="text-sm font-semibold text-ink/60 tabular-nums">
          {index + 1} of {round?.questions.length} · {rightSoFar} right
        </p>
      {/if}
    </Header>

    {#if phase === 'setup'}
      <section class="mx-auto flex w-full max-w-5xl flex-1 flex-col py-10">
        <h1 class="text-[clamp(2rem,5vw,3.5rem)] leading-tight font-semibold tracking-tight">
          What level practice do you want?
        </h1>

        <div class="mt-8 grid gap-3 sm:grid-cols-3">
          {#each levels as option (option.id)}
            <button
              type="button"
              class="rounded-3xl border-2 p-5 text-left transition
                     {level === option.id
                ? 'border-orange bg-white shadow-[0_12px_30px_rgba(23,37,44,0.10)]'
                : 'border-ink/15 hover:border-ink/35'}"
              aria-pressed={level === option.id}
              onclick={() => (level = option.id)}
            >
              <span class="block text-xl font-bold">{option.name}</span>
              <span class="mt-1 block text-sm leading-snug text-ink/60">{option.blurb}</span>
            </button>
          {/each}
        </div>

        <h2 class="mt-10 text-lg font-semibold">How many questions?</h2>
        <div class="mt-3 flex flex-wrap gap-3">
          {#each lengths as option (option)}
            <button
              type="button"
              class="min-h-14 min-w-20 rounded-full border-2 px-6 text-lg font-bold tabular-nums transition
                     {length === option
                ? 'border-ink bg-ink text-white'
                : 'border-ink/20 hover:border-ink/45'}"
              aria-pressed={length === option}
              onclick={() => (length = option)}
            >
              {option}
            </button>
          {/each}
        </div>

        <div class="mt-10">
          <button
            type="button"
            class="min-h-14 rounded-full bg-orange px-8 py-4 text-lg font-bold text-white
                   shadow-[0_12px_30px_rgba(242,107,58,0.30)] transition hover:-translate-y-0.5
                   focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
            onclick={start}
          >
            Start practicing
          </button>
        </div>
      </section>
    {:else if question && (phase === 'asking' || phase === 'checking')}
      <section class="mx-auto flex w-full max-w-5xl flex-1 flex-col py-4 lg:pt-10">
        {#snippet correction()}
          {#if phase === 'checking' && question}
            <div class="mt-5 w-full text-center" role="status" aria-live="polite">
              {#if wasCorrect}
                <p class="text-2xl font-bold text-ink">Yes — {formatTime(question.time)}</p>
              {:else}
                <div class="rounded-3xl border-2 border-orange/35 bg-white p-5 text-left">
                  <p class="text-lg leading-relaxed font-medium text-ink">
                    {explain(wrongKind, question.time)}
                  </p>
                  <button
                    type="button"
                    class="mt-4 min-h-14 rounded-full bg-ink px-7 py-3 text-base font-bold text-white
                           transition hover:bg-orange focus-visible:outline-3
                           focus-visible:outline-offset-4 focus-visible:outline-orange"
                    data-continue
                    onclick={advance}
                  >
                    Got it
                  </button>
                </div>
              {/if}
            </div>
          {/if}
        {/snippet}

        {#if question.direction === 'clock-to-time'}
          <h1 class="text-center text-2xl font-semibold sm:text-3xl">What time is it?</h1>

          <!-- Keep feedback outside the centered grid so answers stay in place. -->
          <div class="mx-auto mt-4 grid w-full max-w-4xl items-center gap-6 lg:mt-8 lg:grid-cols-2 lg:gap-10">
            <div class="mx-auto w-full max-w-[min(46vh,22rem)]">
              <ClockFace
                time={question.time}
                annotate={phase === 'checking' && !wasCorrect ? annotationFor(wrongKind) : null}
              />
            </div>

            <div class="w-full">
              {#if question.options}
                <div class="grid w-full gap-3 sm:grid-cols-2">
                  {#each question.options as option (optionLabel(option))}
                    <button
                      type="button"
                      disabled={phase === 'checking'}
                      class="min-h-16 rounded-2xl border-2 text-3xl font-bold tabular-nums transition
                             {phase === 'checking' && sameTime(option.time, question.time)
                        ? 'border-mint bg-mint text-ink'
                        : phase === 'checking' && picked && sameTime(option.time, picked)
                          ? 'border-orange bg-orange/12 text-ink'
                          : 'border-ink/15 bg-white hover:border-ink/45 disabled:opacity-55'}"
                      onclick={() => chooseOption(option)}
                    >
                      {optionLabel(option)}
                    </button>
                  {/each}
                </div>
              {:else}
                <TimeInput
                  bind:hour={typedHour}
                  bind:minute={typedMinute}
                  disabled={phase === 'checking'}
                  onsubmit={submitTyped}
                />
                {#if inputProblem}
                  <p class="mt-3 text-center font-semibold text-orange" role="alert">
                    {inputProblem}
                  </p>
                {/if}
              {/if}
            </div>
          </div>
        {:else}
          <h1 class="text-center text-2xl font-semibold sm:text-3xl">
            Which clock shows
            <span class="text-orange tabular-nums">{formatTime(question.time)}</span>?
          </h1>

          <div class="mx-auto mt-5 grid w-full max-w-3xl grid-cols-2 gap-4 md:grid-cols-4 lg:mt-8">
            {#each question.options ?? [] as option, position (optionLabel(option))}
              <button
                type="button"
                disabled={phase === 'checking'}
                aria-label="Clock {position + 1} of {question.options?.length}"
                class="rounded-3xl border-2 bg-white p-2 transition
                       {phase === 'checking' && sameTime(option.time, question.time)
                  ? 'border-mint'
                  : phase === 'checking' && picked && sameTime(option.time, picked)
                    ? 'border-orange'
                    : 'border-ink/15 hover:border-ink/45 disabled:opacity-55'}"
                onclick={() => chooseOption(option)}
              >
                <ClockFace time={option.time} />
              </button>
            {/each}
          </div>
        {/if}

        <div class="mx-auto w-full max-w-2xl">
          {@render correction()}
        </div>
      </section>
    {:else if phase === 'results'}
      <section class="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center py-10">
        <h1 class="text-[clamp(2rem,5vw,3.5rem)] leading-tight font-semibold tracking-tight">
          {rightSoFar} out of {answers.length}
        </h1>

        {#if missed.length > 0}
          <h2 class="mt-8 text-lg font-semibold">The ones to look at again</h2>
          <div class="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {#each missed as miss (miss.time.hour + ':' + miss.time.minute)}
              <div>
                <ClockFace time={miss.time} />
                <p class="mt-2 text-center text-sm font-semibold tabular-nums">
                  {formatTime(miss.time)}
                </p>
                {#if miss.answer}
                  <p class="text-center text-sm text-ink/55 tabular-nums">
                    you said {formatTime(miss.answer)}
                  </p>
                {/if}
              </div>
            {/each}
          </div>
        {:else}
          <p class="mt-4 text-xl text-ink/70">Every one right. That's the whole round.</p>
        {/if}

        <div class="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            class="min-h-14 rounded-full bg-orange px-7 py-4 text-base font-bold text-white
                   transition hover:-translate-y-0.5"
            onclick={() => (phase = 'setup')}
          >
            Practice again
          </button>
          <a
            href={resolve('/report')}
            class="inline-flex min-h-14 items-center rounded-full border-2 border-ink px-7 py-4
                   text-base font-bold text-ink transition hover:bg-ink hover:text-white"
          >
            Print my report
          </a>
        </div>

        {#if previous}
          <p class="mt-5 text-sm text-ink/60">
            You didn't print your last round. It's still here if you want it.
          </p>
        {/if}
      </section>
    {/if}
  </div>
</main>
