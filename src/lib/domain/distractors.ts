import { minutesForLevel, pick } from "./time";
import type { ClockTime, Level, Option, Rng } from "./types";

/**
 * Pull a minute onto the Level's own grid. Every option a student sees has to
 * look like a time that Level could ask, or the one that doesn't fit becomes a
 * free elimination.
 */
function snap(minute: number, level: Level): number {
  const grid = minutesForLevel(level);
  const wrapped = ((minute % 60) + 60) % 60;
  return grid.reduce((best, candidate) => {
    const distance = Math.min(
      Math.abs(candidate - wrapped),
      60 - Math.abs(candidate - wrapped),
    );
    const bestDistance = Math.min(
      Math.abs(best - wrapped),
      60 - Math.abs(best - wrapped),
    );
    return distance < bestDistance ? candidate : best;
  }, grid[0]);
}

function withHour(hour: number): number {
  return ((hour - 1 + 12) % 12) + 1;
}

/** Naming the hour the minute hand is approaching rather than the one it left. */
export function hourSlip(time: ClockTime): ClockTime {
  return { hour: withHour(time.hour + 1), minute: time.minute };
}

/**
 * Reading the hour off the minute hand and the minute off the hour hand — the
 * other classic error, and the reason the two hands must look different.
 */
export function swappedHands(time: ClockTime, level: Level): ClockTime {
  const hourFromMinuteHand = withHour(Math.round(time.minute / 5) || 12);
  const minuteFromHourHand = ((time.hour % 12) + time.minute / 60) * 5;
  return { hour: hourFromMinuteHand, minute: snap(minuteFromHourHand, level) };
}

/**
 * Pair two hours with two minutes so neither hand can be inferred from how
 * often its value appears. Keep the Hour Slip in every Question.
 * Easy stays on quarter hours. Medium and Hard use five- or ten-minute gaps
 * so the Clock Faces remain visually distinct, even between ticks at Hard.
 */
export function buildOptions(
  time: ClockTime,
  level: Level,
  rng: Rng,
): Option[] {
  const otherMinute =
    level === "easy"
      ? pick(
          minutesForLevel(level).filter((minute) => minute !== time.minute),
          rng,
        )
      : snap(time.minute + pick([-10, -5, 5, 10], rng), level);
  return shuffleOptions(
    [
      { time, kind: "correct" },
      { time: hourSlip(time), kind: "hour-slip" },
      {
        time: { hour: time.hour, minute: otherMinute },
        kind: level === "easy" ? "other-quarter" : "off-by-five",
      },
      {
        time: { hour: hourSlip(time).hour, minute: otherMinute },
        kind: "hour-and-minute",
      },
    ],
    rng,
  );
}

function shuffleOptions(options: Option[], rng: Rng): Option[] {
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}
