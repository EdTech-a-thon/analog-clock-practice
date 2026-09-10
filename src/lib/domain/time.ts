import type { ClockTime, Level, Rng } from "./types";

/**
 * The minutes each Level puts the minute hand on. The Levels form a ladder in
 * which times appear, not in how the Clock Face is drawn — the dial is
 * identical throughout.
 */
export function minutesForLevel(level: Level): number[] {
  if (level === "easy") return [0, 15, 30, 45];
  if (level === "medium") return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  return Array.from({ length: 60 }, (_, minute) => minute);
}

export function pick<T>(items: readonly T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

export function randomTime(level: Level, rng: Rng): ClockTime {
  return {
    hour: Math.floor(rng() * 12) + 1,
    minute: pick(minutesForLevel(level), rng),
  };
}

export function sameTime(a: ClockTime, b: ClockTime): boolean {
  return a.hour === b.hour && a.minute === b.minute;
}

/** "3:07" — the form the student types and the form the report prints. */
export function formatTime(time: ClockTime): string {
  return `${time.hour}:${String(time.minute).padStart(2, "0")}`;
}
