import { minutesForLevel, randomTime } from "./time";
import type { ClockTime, DistractorKind, Level, Option, Rng } from "./types";

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
 * Miscounts: by quarters at Easy, by fives above it.
 *
 * Hard offers choices only in the Time-to-Clock Direction, where options are
 * drawn as four dials rather than listed as text. Separating them by a single
 * tick would put them six degrees apart and make the question a coin flip, so
 * Hard uses the same five-minute spread as Medium — its difficulty comes from
 * the correct time sitting between the ticks, not from the gaps being
 * invisible. A single-tick error is still recognised when a student types one;
 * it is just never offered as a clock to pick.
 */
function miscounts(
  time: ClockTime,
  level: Level,
): { time: ClockTime; kind: DistractorKind }[] {
  if (level === "easy") {
    return minutesForLevel("easy")
      .filter((minute) => minute !== time.minute)
      .map((minute) => ({
        time: { hour: time.hour, minute },
        kind: "other-quarter" as const,
      }));
  }
  return [5, -5, 10, -10].map((offset) => ({
    time: { hour: time.hour, minute: snap(time.minute + offset, level) },
    kind: "off-by-five" as const,
  }));
}

/**
 * Two options are too close to offer together when they share an hour and sit
 * within a few minutes of each other: as text they invite a coin flip, and as
 * two dials they are the same picture. Swapped hands lands here often at Hard —
 * 3:17 reads back as 3:16 — so it gets dropped rather than shown.
 */
function tooClose(a: ClockTime, b: ClockTime): boolean {
  if (a.hour !== b.hour) return false;
  const gap = Math.abs(a.minute - b.minute);
  return Math.min(gap, 60 - gap) < 5;
}

/**
 * Four options, one correct. The Hour Slip is offered first whenever the minute
 * hand is past the six, because that is exactly when the hour hand appears to
 * be pointing at the next numeral.
 */
export function buildOptions(
  time: ClockTime,
  level: Level,
  rng: Rng,
): Option[] {
  const candidates: { time: ClockTime; kind: DistractorKind }[] = [];
  if (time.minute > 30)
    candidates.push({ time: hourSlip(time), kind: "hour-slip" });
  candidates.push({ time: swappedHands(time, level), kind: "swapped-hands" });
  candidates.push(...miscounts(time, level));

  const chosen: Option[] = [];
  const taken = [time];
  for (const candidate of candidates) {
    if (chosen.length === 3) break;
    if (taken.some((seen) => tooClose(seen, candidate.time))) continue;
    taken.push(candidate.time);
    chosen.push(candidate);
  }

  const fallbackKind: DistractorKind =
    level === "easy" ? "other-quarter" : "off-by-five";
  while (chosen.length < 3) {
    const candidate = randomTime(level, rng);
    if (taken.some((seen) => tooClose(seen, candidate))) continue;
    taken.push(candidate);
    chosen.push({ time: candidate, kind: fallbackKind });
  }

  const options: Option[] = [{ time, kind: "correct" }, ...chosen];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}
