import { buildOptions } from "./distractors";
import { randomTime, sameTime } from "./time";
import type {
  ClockTime,
  Direction,
  Level,
  Question,
  Rng,
  Round,
} from "./types";

export type RoundLength = 5 | 10 | 20;

function shuffle<T>(items: T[], rng: Rng): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Both Directions in equal measure, shuffled. An odd length gives the extra
 * Question to a random Direction rather than stacking one end of the Round, so
 * a 5-Question Round is 3 and 2 and never 5 and 0.
 */
function directionsFor(length: number, rng: Rng): Direction[] {
  const half = Math.floor(length / 2);
  const directions: Direction[] = [
    ...Array<Direction>(half).fill("clock-to-time"),
    ...Array<Direction>(half).fill("time-to-clock"),
  ];
  if (directions.length < length) {
    directions.push(rng() < 0.5 ? "clock-to-time" : "time-to-clock");
  }
  return shuffle(directions, rng);
}

/**
 * Distinct times, so a Round covers ground rather than circling. The 20-Question
 * maximum sits inside the 48 distinct times Easy can produce, so this always
 * terminates.
 */
function distinctTimes(level: Level, count: number, rng: Rng): ClockTime[] {
  const times: ClockTime[] = [];
  while (times.length < count) {
    const candidate = randomTime(level, rng);
    if (!times.some((time) => sameTime(time, candidate))) times.push(candidate);
  }
  return times;
}

export function buildRound(level: Level, length: RoundLength, rng: Rng): Round {
  const directions = directionsFor(length, rng);
  const times = distinctTimes(level, length, rng);

  const questions: Question[] = times.map((time, index) => {
    const direction = directions[index];
    // Hard is the only Level that asks for a typed answer, and only when the
    // student is reading a Clock Face. Picking a clock is always a choice.
    const typed = level === "hard" && direction === "clock-to-time";
    return {
      time,
      direction,
      options: typed ? null : buildOptions(time, level, rng),
    };
  });

  return { level, questions };
}
