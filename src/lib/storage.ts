import type { ClockTime, Direction, Level } from "./domain/types";

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
