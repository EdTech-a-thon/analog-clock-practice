<script lang="ts">
  import { handAngles } from "$lib/domain/angles";
  import type { ClockTime } from "$lib/domain/types";

  type Props = {
    time: ClockTime;
    /** Highlights one hand after a miss, so the correction points at something. */
    annotate?: "hour" | "minute" | null;
    /** Line art for print: no fills, no shadow. */
    plain?: boolean;
  };

  let { time, annotate = null, plain = false }: Props = $props();

  const angles = $derived(handAngles(time));

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
  aria-label={describe(time)}
>
  <circle
    cx="100"
    cy="100"
    r="94"
    fill={plain ? "none" : "#ffffff"}
    stroke="#111111"
    stroke-width={plain ? 2.5 : 9}
  />

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

  <circle cx="100" cy="100" r="4.5" fill="#111111" />
</svg>
