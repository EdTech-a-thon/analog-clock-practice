<script lang="ts">
  import { formatTime } from "$lib/domain/time";
  import { handAngles } from "$lib/domain/angles";
  import type { ClockTime } from "$lib/domain/types";

  type Props = {
    time: ClockTime;
    answer?: ClockTime | null;
    /** Highlights one hand after a miss, so the correction points at something. */
    annotate?: "hour" | "minute" | null;
    /** Line art for print: no fills, no shadow. */
    plain?: boolean;
  };

  let { time, answer = null, annotate = null, plain = false }: Props = $props();

  const angles = $derived(handAngles(time));

  const comparison = $derived(answer && !plain ? answer : null);
  const answerAngles = $derived(comparison ? handAngles(comparison) : angles);
  const hands = $derived([
    {
      name: "minute",
      radius: 75,
      width: 4,
      correct: angles.minute,
      chosen: answerAngles.minute,
      matches: comparison?.minute === time.minute,
    },
    {
      name: "hour",
      radius: 45,
      width: 7,
      correct: angles.hour,
      chosen: answerAngles.hour,
      matches: comparison?.hour === time.hour,
    },
  ]);

  function wedge(from: number, to: number, radius: number): string {
    const delta = ((to - from + 540) % 360) - 180;
    const point = (angle: number) => {
      const radians = (angle * Math.PI) / 180;
      return `${100 + Math.sin(radians) * radius} ${100 - Math.cos(radians) * radius}`;
    };
    return `M 100 100 L ${point(from)} A ${radius} ${radius} 0 0 ${delta >= 0 ? 1 : 0} ${point(from + delta)} Z`;
  }

  const ticks = Array.from({ length: 60 }, (_, index) => ({
    rotation: index * 6,
    major: index % 5 === 0,
  }));

  const numerals = Array.from({ length: 12 }, (_, index) => {
    const numeral = index + 1;
    const radians = (numeral * 30 * Math.PI) / 180;
    return {
      numeral,
      x: 100 + Math.sin(radians) * 65,
      y: 100 - Math.cos(radians) * 65,
    };
  });

  /**
   * Describes where the hands point rather than what time it is. A screen
   * reader user gets the same puzzle everyone else does instead of the answer.
   */
  function describe(at: ClockTime): string {
    const next = (at.hour % 12) + 1;
    const hourHand =
      at.minute === 0
        ? `The hour hand points at the ${at.hour}.`
        : `The hour hand is between the ${at.hour} and the ${next}.`;

    const before =
      Math.floor(at.minute / 5) === 0 ? 12 : Math.floor(at.minute / 5);
    const after =
      Math.ceil(at.minute / 5) === 0 ? 12 : Math.ceil(at.minute / 5);
    const minuteHand =
      at.minute % 5 === 0
        ? `The minute hand points at the ${at.minute === 0 ? 12 : at.minute / 5}.`
        : `The minute hand is between the ${before} and the ${after}.`;

    return `An analog clock. ${hourHand} ${minuteHand}`;
  }
</script>

<svg
  viewBox="0 0 200 200"
  class="block h-auto w-full"
  role="img"
  aria-label={comparison
    ? `Your answer: ${formatTime(comparison)}. Correct time: ${formatTime(time)}. Hour ${comparison.hour === time.hour ? "correct" : "incorrect"}. Minutes ${comparison.minute === time.minute ? "correct" : "incorrect"}. Colored hands show your answer; black hands show the correct positions.`
    : describe(time)}
>
  <circle
    cx="100"
    cy="100"
    r="94"
    fill={plain ? "none" : "#ffffff"}
    stroke="#111111"
    stroke-width={plain ? 2.5 : 9}
  />

  {#if comparison}
    {#each hands as hand (hand.name)}
      {#if !hand.matches}
        <path
          d={wedge(hand.chosen, hand.correct, hand.radius)}
          fill="#c2410c"
          fill-opacity="0.12"
        />
      {/if}
    {/each}
  {/if}

  {#each ticks as tick (tick.rotation)}
    <line
      x1="100"
      y1="15"
      x2="100"
      y2={tick.major ? 24 : 19}
      stroke="#111111"
      stroke-width={tick.major ? 2.5 : 0.9}
      stroke-linecap="butt"
      transform="rotate({tick.rotation} 100 100)"
    />
  {/each}

  {#each numerals as numeral (numeral.numeral)}
    <text
      x={numeral.x}
      y={numeral.y}
      text-anchor="middle"
      dominant-baseline="central"
      font-size="21"
      font-weight="700"
      fill="#111111"
      font-family="Arial, Helvetica, sans-serif">{numeral.numeral}</text
    >
  {/each}

  {#if comparison}
    {#each hands as hand (hand.name)}
      {#if hand.chosen !== hand.correct}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2={100 - hand.radius}
          stroke="#111111"
          stroke-width={hand.width}
          stroke-linecap="round"
          transform="rotate({hand.correct} 100 100)"
        />
      {/if}
      <line
        x1="100"
        y1="106"
        x2="100"
        y2={100 - hand.radius}
        stroke={hand.matches ? "#0369a1" : "#c2410c"}
        stroke-width={hand.width}
        stroke-linecap="round"
        transform="rotate({hand.chosen} 100 100)"
      />
    {/each}
  {:else}
    <!-- Minute hand: long and thin. Drawn first so the hour hand sits on top. -->
    <line
      x1="100"
      y1="108"
      x2="100"
      y2="25"
      stroke={annotate === "minute" ? "#f26b3a" : "#111111"}
      stroke-width={annotate === "minute" ? 6 : 4}
      stroke-linecap="round"
      transform="rotate({angles.minute} 100 100)"
    />

    <!-- Hour hand: short and thick, and never parked on the numeral. -->
    <line
      x1="100"
      y1="107"
      x2="100"
      y2="55"
      stroke={annotate === "hour" ? "#f26b3a" : "#111111"}
      stroke-width={annotate === "hour" ? 9 : 7}
      stroke-linecap="round"
      transform="rotate({angles.hour} 100 100)"
    />
  {/if}

  <circle cx="100" cy="100" r="4.5" fill="#111111" />
</svg>
