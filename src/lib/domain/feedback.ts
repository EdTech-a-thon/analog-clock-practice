import { hourSlip, swappedHands } from "./distractors";
import { formatTime, sameTime } from "./time";
import type { ClockTime, DistractorKind, Level } from "./types";

/**
 * Work out which mistake a typed answer represents, so a Hard Question can give
 * the same tailored correction a multiple-choice Question does.
 */
export function classify(
  answer: ClockTime,
  time: ClockTime,
  level: Level,
): DistractorKind | null {
  if (sameTime(answer, hourSlip(time))) return "hour-slip";
  if (sameTime(answer, swappedHands(time, level))) return "swapped-hands";

  // A miscount keeps the hour and misses the minute. Which wording helps
  // depends on how far out they were: a tick or two is a tick-counting slip,
  // a clean multiple of five is a counting-by-fives slip.
  if (answer.hour === time.hour) {
    const gap = Math.abs(answer.minute - time.minute);
    const minutesOut = Math.min(gap, 60 - gap);
    if (minutesOut > 0 && minutesOut <= 2) return "off-by-tick";
    if (minutesOut > 0 && minutesOut % 5 === 0) return "off-by-five";
  }
  return null;
}

function nextHour(hour: number): number {
  return (hour % 12) + 1;
}

/**
 * The correction a student reads after a miss. Short sentences, name the hand,
 * state the rule, then give the answer — in that order, because the answer is
 * the least useful part.
 */
export function explain(kind: DistractorKind | null, time: ClockTime): string {
  const answer = `The time is ${formatTime(time)}.`;

  if (kind === "hour-slip") {
    return (
      `Look at the hour hand. It is between the ${time.hour} and the ` +
      `${nextHour(time.hour)}, and it has not reached the ${nextHour(time.hour)} ` +
      `yet. The hour is still ${time.hour}. ${answer}`
    );
  }

  if (kind === "swapped-hands") {
    return (
      `Check which hand is which. The short hand is the hour hand and the long ` +
      `hand is the minute hand. Read the hour from the short one. ${answer}`
    );
  }

  // Advice has to suit the time being read, not just the mistake made: telling
  // a student to count by fives towards 6:28 sends them somewhere fives can
  // never reach. Any time off the five-minute marks needs tick counting.
  if (kind === "off-by-tick" || time.minute % 5 !== 0) {
    return (
      `Find the nearest number below the minute hand, then count the small ` +
      `ticks past it one at a time. ${answer}`
    );
  }

  return `Count around the clock by fives to where the minute hand points. ${answer}`;
}
