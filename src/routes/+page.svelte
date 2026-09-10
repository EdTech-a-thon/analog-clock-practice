<script lang="ts">
  import { resolve } from "$app/paths";

  // The practice route is owned by the practice-flow feature and may land independently.
  const practiceHref = "/practice" as "/";

  const ticks = Array.from({ length: 60 }, (_, index) => ({
    rotation: index * 6,
    major: index % 5 === 0,
  }));

  const hourNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
    (number, index) => {
      const angle = (index * 30 * Math.PI) / 180;

      return {
        number,
        left: 50 + Math.sin(angle) * 42,
        top: 50 - Math.cos(angle) * 42,
      };
    },
  );
</script>

<svelte:head>
  <title>Practice Reading an Analog Clock — Clock Literacy</title>
  <meta
    name="description"
    content="Build confidence reading analog clocks with focused, self-paced practice."
  />
</svelte:head>

<main
  class="relative min-h-screen overflow-hidden bg-cream px-5 py-5 sm:px-8 lg:px-12"
>
  <div
    class="pointer-events-none absolute inset-0 opacity-55"
    aria-hidden="true"
  >
    <div
      class="absolute -top-20 left-[42%] h-52 w-52 rounded-full border border-orange/15"
    ></div>
    <div
      class="absolute right-[6%] bottom-[10%] h-28 w-28 rounded-full bg-mint/35 blur-2xl"
    ></div>
  </div>

  <div
    class="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl flex-col"
  >
    <header class="flex items-center border-b border-ink/12 pb-5">
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
    </header>

    <section
      class="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:py-10"
    >
      <div class="relative z-10 max-w-2xl">
        <h1
          class="max-w-3xl text-[clamp(2.8rem,11.5vw,3.5rem)] leading-[0.94] font-semibold tracking-[-0.04em] text-ink sm:text-[clamp(3.5rem,7vw,6.7rem)] sm:leading-[0.92] sm:tracking-[-0.045em]"
        >
          <span class="block">Practice Reading</span>
          <span class="block">an Analog Clock.</span>
        </h1>
        <p
          class="mt-5 max-w-lg text-lg leading-relaxed text-ink/68 sm:mt-8 sm:text-xl"
        >
          Choose a level and get started.
        </p>

        <div class="mt-5 sm:mt-9">
          <a
            href={resolve(practiceHref)}
            class="group inline-flex min-h-14 items-center gap-4 rounded-full bg-ink px-7 py-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(23,37,44,0.18)] transition hover:-translate-y-0.5 hover:bg-orange focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-orange"
          >
            Start practicing
            <span
              class="grid size-7 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-1"
              aria-hidden="true">→</span
            >
          </a>
        </div>
      </div>

      <div
        class="relative mx-auto w-full max-w-[560px] lg:ml-auto"
        aria-label="An analog clock face showing ten past ten"
      >
        <div
          class="absolute -inset-7 rounded-full border-2 border-dashed border-ink/20 sm:-inset-10"
        ></div>
        <div
          class="absolute -top-6 -right-2 rotate-6 rounded-full bg-orange px-4 py-2 text-xs font-bold tracking-wide text-white uppercase shadow-lg sm:right-4"
        >
          Take your time
        </div>

        <div
          class="relative aspect-square rounded-full bg-[#fffdf7] p-[5%] shadow-[0_30px_80px_rgba(23,37,44,0.14),inset_0_0_0_3px_rgba(23,37,44,0.12)]"
        >
          <div
            class="relative h-full w-full rounded-full border-[3px] border-ink/85"
          >
            {#each ticks as tick (tick.rotation)}
              <span
                class="absolute top-0 left-1/2 h-1/2 w-px origin-bottom"
                style:transform={`translateX(-50%) rotate(${tick.rotation}deg)`}
              >
                <span
                  class:h-3={tick.major}
                  class:h-1.5={!tick.major}
                  class="block w-[2px] bg-ink/65"
                ></span>
              </span>
            {/each}

            {#each hourNumbers as hour (hour.number)}
              <span
                class="absolute top-1/2 left-1/2 grid size-10 place-items-center text-xl font-semibold sm:text-2xl"
                style:left={`${hour.left}%`}
                style:top={`${hour.top}%`}
                style:transform="translate(-50%, -50%)">{hour.number}</span
              >
            {/each}

            <span
              class="absolute top-1/2 left-1/2 h-[29%] w-2 origin-bottom -translate-x-1/2 -translate-y-full rotate-[300deg] rounded-full bg-ink"
            ></span>
            <span
              class="absolute top-1/2 left-1/2 h-[38%] w-1.5 origin-bottom -translate-x-1/2 -translate-y-full rotate-[60deg] rounded-full bg-orange"
            ></span>
            <span
              class="absolute top-1/2 left-1/2 size-5 -translate-1/2 rounded-full border-[5px] border-white bg-ink shadow-sm"
            ></span>
          </div>
        </div>
      </div>
    </section>
  </div>

  <section
    class="relative mx-auto my-8 max-w-7xl border-t border-ink/12 py-14 sm:py-18"
    aria-labelledby="how-it-works"
  >
    <div class="mx-auto max-w-5xl">
      <div class="text-center">
        <h2
          id="how-it-works"
          class="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
        >
          Three levels of difficulty
        </h2>
      </div>

      <ol class="mt-10 grid gap-4 md:grid-cols-3">
        {#each [{ level: "Easy", detail: "The clock only shows quarter hours.", minute: 0, hour: 60 }, { level: "Medium", detail: "The clock only shows times on five-minute marks.", minute: 60, hour: 105 }, { level: "Hard", detail: "The clock can show any time.", minute: 204, hour: 66 }] as item (item.level)}
          <li
            class="relative flex items-center gap-5 rounded-3xl border border-ink/12 bg-white/45 p-5 sm:p-6 md:flex-col md:text-center"
          >
            <svg
              viewBox="0 0 120 120"
              class="size-24 shrink-0 sm:size-28"
              aria-hidden="true"
            >
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="#fffdf7"
                stroke="#17252c"
                stroke-width="2"
              />
              {#each ticks.filter((tick) => tick.major) as tick (tick.rotation)}
                <line
                  x1="60"
                  y1="9"
                  x2="60"
                  y2="15"
                  stroke="#17252c"
                  stroke-width="2"
                  stroke-linecap="round"
                  transform={`rotate(${tick.rotation} 60 60)`}
                />
              {/each}
              <line
                x1="60"
                y1="60"
                x2="60"
                y2="32"
                stroke="#17252c"
                stroke-width="5"
                stroke-linecap="round"
                transform={`rotate(${item.hour} 60 60)`}
              />
              <line
                x1="60"
                y1="60"
                x2="60"
                y2="18"
                stroke="#f26b3a"
                stroke-width="3"
                stroke-linecap="round"
                transform={`rotate(${item.minute} 60 60)`}
              />
              <circle cx="60" cy="60" r="5" fill="#17252c" />
            </svg>
            <div>
              <h3 class="text-lg font-bold">{item.level}</h3>
              <p class="mt-1 text-sm text-ink/55">{item.detail}</p>
            </div>
          </li>
        {/each}
      </ol>

      <div
        class="mt-8 grid gap-4 border-t border-ink/12 pt-8 sm:grid-cols-2 sm:gap-10"
      >
        <div class="flex gap-4">
          <span class="text-2xl text-orange" aria-hidden="true">↔</span>
          <div>
            <h3 class="font-bold">Two kinds of questions</h3>
            <p class="mt-1 text-sm leading-relaxed text-ink/55">
              Students enter the time shown on a clock, or choose the clock face
              that matches a given time.
            </p>
          </div>
        </div>
        <div class="flex gap-4">
          <svg
            viewBox="0 0 24 24"
            class="mt-0.5 size-5 shrink-0 text-orange"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path
              d="M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v6H7z"
            />
          </svg>
          <div>
            <h3 class="font-bold">Save or print a report</h3>
            <p class="mt-1 text-sm leading-relaxed text-ink/55">
              Save the Practice Report as a PDF to upload or email to a teacher.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
