import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildRound } from "./domain/round";
import {
  clearPendingRound,
  loadPendingRound,
  savePendingRound,
} from "./storage";

describe("unfinished Round storage", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("preserves questions and checked answers, then clears the saved Round", () => {
    const round = buildRound("medium", 5, Math.random);
    const question = round.questions[0];
    const answers = [
      {
        time: question.time,
        direction: question.direction,
        answer: question.time,
        correct: true,
      },
    ];
    savePendingRound({ round, index: 0, answers: [] });
    expect(loadPendingRound()).toEqual({ round, index: 0, answers: [] });
    savePendingRound({ round, index: 0, answers });
    expect(loadPendingRound()).toEqual({ round, index: 0, answers });
    savePendingRound({ round, index: 1, answers });
    expect(loadPendingRound()).toEqual({ round, index: 1, answers });
    clearPendingRound();
    expect(loadPendingRound()).toBeNull();
  });

  it("rejects malformed or inconsistent saved progress", () => {
    localStorage.setItem("clock-literacy:pending-round", "broken JSON");
    expect(loadPendingRound()).toBeNull();
    savePendingRound({
      round: buildRound("hard", 5, Math.random),
      index: 3,
      answers: [],
    });
    expect(loadPendingRound()).toBeNull();
  });

  it("keeps practice usable when storage is disabled", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("disabled");
      },
      setItem: () => {
        throw new Error("disabled");
      },
      removeItem: () => {
        throw new Error("disabled");
      },
    });
    expect(loadPendingRound()).toBeNull();
    expect(() =>
      savePendingRound({
        round: buildRound("easy", 5, Math.random),
        index: 0,
        answers: [],
      }),
    ).not.toThrow();
    expect(() => clearPendingRound()).not.toThrow();
  });
});
