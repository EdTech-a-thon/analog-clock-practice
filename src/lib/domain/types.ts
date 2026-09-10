/** A time as an analog dial can express it: no date, no meridiem, no seconds. */
export type ClockTime = { hour: number; minute: number };

/** Whether a Question's time is AM or PM. Context only; nothing depends on it. */
export type Meridiem = "AM" | "PM";

export type Level = "easy" | "medium" | "hard";

/** Which way a Question runs. */
export type Direction = "clock-to-time" | "time-to-clock";

/**
 * Why an option is wrong. Each kind is a mistake students actually make, and
 * each gets its own wording in the feedback.
 */
export type DistractorKind =
  | "hour-slip"
  | "swapped-hands"
  | "off-by-five"
  | "off-by-tick"
  | "other-quarter";

export type Option = { time: ClockTime; kind: "correct" | DistractorKind };

export type Question = {
  time: ClockTime;
  meridiem: Meridiem;
  direction: Direction;
  /** Null when the student types the answer instead of choosing it. */
  options: Option[] | null;
};

export type Round = { level: Level; questions: Question[] };

/** Injected so Rounds are reproducible under test. */
export type Rng = () => number;
