import { describe, expect, it } from "vitest";
import { buildRound } from "./round";
import type { Level, Rng } from "./types";

/** Deterministic Rng so a failing Round can be reproduced from its seed. */
function seeded(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Twenty seeds is enough to shake out rules that hold only by luck. */
const seeds = Array.from({ length: 20 }, (_, i) => i + 1);
const levels: Level[] = ["easy", "medium", "hard"];

describe("buildRound", () => {
  it("holds as many Questions as asked for", () => {
    for (const length of [5, 10, 20] as const) {
      expect(buildRound("medium", length, seeded(1)).questions).toHaveLength(
        length,
      );
    }
  });

  it("keeps the minute hand on the quarter hours at Easy", () => {
    for (const seed of seeds) {
      for (const question of buildRound("easy", 20, seeded(seed)).questions) {
        expect([0, 15, 30, 45]).toContain(question.time.minute);
      }
    }
  });

  it("keeps the minute hand on the five-minute marks at Medium", () => {
    for (const seed of seeds) {
      for (const question of buildRound("medium", 20, seeded(seed)).questions) {
        expect(question.time.minute % 5).toBe(0);
      }
    }
  });

  it("lets the minute hand land between the marks at Hard", () => {
    const minutes = seeds.flatMap((seed) =>
      buildRound("hard", 20, seeded(seed)).questions.map((q) => q.time.minute),
    );
    expect(minutes.some((minute) => minute % 5 !== 0)).toBe(true);
  });

  it("names the hour between 1 and 12 at every Level", () => {
    for (const level of levels) {
      for (const question of buildRound(level, 20, seeded(7)).questions) {
        expect(question.time.hour).toBeGreaterThanOrEqual(1);
        expect(question.time.hour).toBeLessThanOrEqual(12);
      }
    }
  });

  it("splits the Directions evenly when the length allows", () => {
    for (const seed of seeds) {
      for (const length of [10, 20] as const) {
        const questions = buildRound("medium", length, seeded(seed)).questions;
        const asked = questions.filter((q) => q.direction === "clock-to-time");
        expect(asked).toHaveLength(length / 2);
      }
    }
  });

  it("splits an odd length as evenly as it can rather than lopsidedly", () => {
    for (const seed of seeds) {
      const questions = buildRound("medium", 5, seeded(seed)).questions;
      const asked = questions.filter(
        (q) => q.direction === "clock-to-time",
      ).length;
      expect([2, 3]).toContain(asked);
    }
  });

  it("shuffles the Directions rather than strictly alternating them", () => {
    const rounds = seeds.map(
      (seed) => buildRound("medium", 10, seeded(seed)).questions,
    );
    const hasRepeatedDirection = rounds.some((questions) =>
      questions.some(
        (q, i) => i > 0 && questions[i - 1].direction === q.direction,
      ),
    );
    expect(hasRepeatedDirection).toBe(true);
  });

  it("never asks the same time twice in one Round", () => {
    for (const level of levels) {
      for (const seed of seeds) {
        const questions = buildRound(level, 20, seeded(seed)).questions;
        const seen = new Set(
          questions.map((q) => `${q.time.hour}:${q.time.minute}`),
        );
        expect(seen.size).toBe(questions.length);
      }
    }
  });

  it("asks the student to type the answer only when reading a Clock Face at Hard", () => {
    for (const seed of seeds) {
      for (const question of buildRound("hard", 20, seeded(seed)).questions) {
        const typed = question.options === null;
        expect(typed).toBe(question.direction === "clock-to-time");
      }
    }
  });

  it("always offers choices below Hard", () => {
    for (const level of ["easy", "medium"] as const) {
      for (const question of buildRound(level, 20, seeded(3)).questions) {
        expect(question.options).not.toBeNull();
      }
    }
  });

  it("offers exactly four distinct options, one of them correct", () => {
    for (const level of levels) {
      for (const seed of seeds) {
        for (const question of buildRound(level, 20, seeded(seed)).questions) {
          if (question.options === null) continue;
          expect(question.options).toHaveLength(4);
          const shown = new Set(
            question.options.map((o) => `${o.time.hour}:${o.time.minute}`),
          );
          expect(shown.size).toBe(4);
          const correct = question.options.filter((o) => o.kind === "correct");
          expect(correct).toHaveLength(1);
          expect(correct[0].time).toEqual(question.time);
        }
      }
    }
  });

  it("offers an Hour Slip whenever the hour hand leans towards the next numeral", () => {
    for (const level of levels) {
      for (const seed of seeds) {
        for (const question of buildRound(level, 20, seeded(seed)).questions) {
          if (question.options === null || question.time.minute <= 30) continue;
          const slip = question.options.find((o) => o.kind === "hour-slip");
          expect(slip).toBeDefined();
          expect(slip!.time.minute).toBe(question.time.minute);
          expect(slip!.time.hour).toBe((question.time.hour % 12) + 1);
        }
      }
    }
  });

  it("keeps every option on the Level's own grid, so the odd one out is never a giveaway", () => {
    const grids: Record<Level, number[]> = {
      easy: [0, 15, 30, 45],
      medium: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
      hard: Array.from({ length: 60 }, (_, m) => m),
    };
    for (const level of levels) {
      for (const seed of seeds) {
        for (const question of buildRound(level, 20, seeded(seed)).questions) {
          for (const option of question.options ?? []) {
            expect(grids[level]).toContain(option.time.minute);
            expect(option.time.hour).toBeGreaterThanOrEqual(1);
            expect(option.time.hour).toBeLessThanOrEqual(12);
          }
        }
      }
    }
  });

  it("draws Distractors only from the mistakes modelled for that Level", () => {
    const allowed: Record<Level, string[]> = {
      easy: ["correct", "hour-slip", "swapped-hands", "other-quarter"],
      medium: ["correct", "hour-slip", "swapped-hands", "off-by-five"],
      hard: ["correct", "hour-slip", "swapped-hands", "off-by-five"],
    };
    for (const level of levels) {
      for (const seed of seeds) {
        for (const question of buildRound(level, 20, seeded(seed)).questions) {
          for (const option of question.options ?? []) {
            expect(allowed[level]).toContain(option.kind);
          }
        }
      }
    }
  });

  it("keeps rendered clock options far enough apart to tell apart by eye", () => {
    // Options are only ever drawn as clocks in the Time-to-Clock Direction.
    for (const level of levels) {
      for (const seed of seeds) {
        for (const question of buildRound(level, 20, seeded(seed)).questions) {
          if (question.direction !== "time-to-clock" || !question.options)
            continue;
          for (const option of question.options) {
            if (option.kind === "correct") continue;
            const gap = Math.abs(option.time.minute - question.time.minute);
            const minutesApart = Math.min(gap, 60 - gap);
            const differentHour = option.time.hour !== question.time.hour;
            expect(differentHour || minutesApart >= 5).toBe(true);
          }
        }
      }
    }
  });
});
