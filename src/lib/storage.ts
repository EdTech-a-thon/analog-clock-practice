import type { ClockTime, Direction, Level, Round } from "./domain/types";

export type AnsweredQuestion = {
  time: ClockTime;
  direction: Direction;
  /** What the student picked or typed. Null only if a Round was abandoned. */
  answer: ClockTime | null;
  correct: boolean;
};

export type CompletedRound = {
  level: Level;
  finishedAt: string;
  answers: AnsweredQuestion[];
  printed: boolean;
};

const ROUNDS_KEY = "clock-literacy:rounds";
const NAME_KEY = "clock-literacy:name";

/**
 * Only the last two Rounds survive (ADR-0001): enough that a student who starts
 * a new Round before printing can still recover the one before it, and no more.
 */
const KEEP = 2;

function read(): CompletedRound[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(ROUNDS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CompletedRound[]) : [];
  } catch {
    return [];
  }
}

function write(rounds: CompletedRound[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(ROUNDS_KEY, JSON.stringify(rounds.slice(0, KEEP)));
  } catch {
    // A full or disabled store costs the student their history, never their Round.
  }
}

export function saveRound(round: CompletedRound): void {
  write([round, ...read()]);
}

export function latestRound(): CompletedRound | null {
  return read()[0] ?? null;
}

/** The Round before the latest, offered for printing only if it never was. */
export function unprintedPreviousRound(): CompletedRound | null {
  const previous = read()[1];
  return previous && !previous.printed ? previous : null;
}

export function markPrinted(finishedAt: string): void {
  write(
    read().map((round) =>
      round.finishedAt === finishedAt ? { ...round, printed: true } : round,
    ),
  );
}

export function loadName(): string {
  if (typeof localStorage === "undefined") return "";
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveName(name: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // Not worth interrupting the student over.
  }
}

export function score(round: CompletedRound): number {
  return round.answers.filter((answer) => answer.correct).length;
}

/** One unfinished Round, including the feedback currently on screen. */
export type PendingRound = {
  round: Round;
  index: number;
  answers: AnsweredQuestion[];
};

const PENDING_KEY = "clock-literacy:pending-round";

export function savePendingRound(pending: PendingRound): void {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    // Practice still works when browser storage is unavailable.
  }
}

export function clearPendingRound(): void {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    // Storage may be disabled.
  }
}

export function loadPendingRound(): PendingRound | null {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) ?? "null");
    if (!pending || !["easy", "medium", "hard"].includes(pending.round?.level))
      return null;
    const { round, index, answers } = pending;
    const isTime = (time: ClockTime) =>
      time &&
      Number.isInteger(time.hour) &&
      time.hour >= 1 &&
      time.hour <= 12 &&
      Number.isInteger(time.minute) &&
      time.minute >= 0 &&
      time.minute <= 59;
    if (
      !Array.isArray(round.questions) ||
      ![5, 10, 20].includes(round.questions.length) ||
      !Number.isInteger(index) ||
      index < 0 ||
      index >= round.questions.length ||
      !Array.isArray(answers) ||
      (answers.length !== index && answers.length !== index + 1)
    )
      return null;
    if (
      !round.questions.every(
        (question: Round["questions"][number]) =>
          question &&
          isTime(question.time) &&
          ["clock-to-time", "time-to-clock"].includes(question.direction) &&
          (question.options === null
            ? round.level === "hard" && question.direction === "clock-to-time"
            : Array.isArray(question.options) &&
              question.options.length === 4 &&
              question.options.every(
                (option) =>
                  option &&
                  isTime(option.time) &&
                  [
                    "correct",
                    "hour-and-minute",
                    "hour-slip",
                    "swapped-hands",
                    "off-by-five",
                    "off-by-tick",
                    "other-quarter",
                  ].includes(option.kind),
              )),
      )
    )
      return null;
    if (
      !answers.every((answer: AnsweredQuestion, position: number) => {
        const question = round.questions[position];
        return (
          answer &&
          isTime(answer.time) &&
          answer.answer &&
          isTime(answer.answer) &&
          answer.time.hour === question.time.hour &&
          answer.time.minute === question.time.minute &&
          answer.direction === question.direction &&
          answer.correct ===
            (answer.answer.hour === question.time.hour &&
              answer.answer.minute === question.time.minute)
        );
      })
    )
      return null;
    return pending as PendingRound;
  } catch {
    return null;
  }
}
