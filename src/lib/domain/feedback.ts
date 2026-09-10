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

/** Explain the relevant hands using the numbers on this Question's Clock Face. */
export function explain(kind: DistractorKind | null, time: ClockTime): string {
  const answer = `The time is ${formatTime(time)}.`;
  const hourAdvice =
    time.minute === 0
      ? `The short hand points to ${time.hour}, so the hour is ${time.hour}.`
      : `The short hand is between ${time.hour} and ${nextHour(time.hour)}. It has passed ${time.hour}, so the hour is still ${time.hour}.`;

  let minuteAdvice: string;
  if (time.minute === 0) {
    minuteAdvice = "The long minute hand points to 12. That means 00 minutes.";
  } else if (time.minute % 5 === 0) {
    minuteAdvice = `The long minute hand points to ${time.minute / 5}. Each number is 5 minutes, so count by fives from 12 to get ${time.minute} minutes.`;
  } else {
    const wholeFives = Math.floor(time.minute / 5);
    const ticks = time.minute % 5;
    const startNumber = wholeFives === 0 ? 12 : wholeFives;
    minuteAdvice = `The long minute hand is ${ticks} small ${ticks === 1 ? "tick" : "ticks"} past ${startNumber}. Start at ${wholeFives * 5} minutes and count the small ticks: add ${ticks} to get ${time.minute} minutes.`;
  }

  if (kind === "hour-slip") return `${hourAdvice} ${answer}`;
  if (kind === "swapped-hands") {
    return `The short hand shows the hour; the long hand shows the minutes. ${hourAdvice} ${minuteAdvice} ${answer}`;
  }
  if (kind === "hour-and-minute" || kind === null) {
    return `${hourAdvice} ${minuteAdvice} ${answer}`;
  }
  return `${minuteAdvice} ${answer}`;
}
