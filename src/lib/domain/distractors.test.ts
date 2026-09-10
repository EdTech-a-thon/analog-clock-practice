import { describe, expect, it } from "vitest";
import { buildOptions } from "./distractors";
import { minutesForLevel } from "./time";
import { explain } from "./feedback";

describe.each(["easy", "medium", "hard"] as const)(
  "%s Distractors",
  (level) => {
    it("requires reading both hands at every time, including across twelve and zero minutes", () => {
      for (let hour = 1; hour <= 12; hour++) {
        for (const minute of minutesForLevel(level)) {
          for (const random of [0, 0.3, 0.6, 0.9]) {
            const options = buildOptions({ hour, minute }, level, () => random);
            const hours = new Set(options.map((option) => option.time.hour));
            const minutes = new Set(
              options.map((option) => option.time.minute),
            );
            expect(hours.size).toBe(2);
            expect(minutes.size).toBe(2);
            for (const value of hours) {
              expect(
                options.filter((option) => option.time.hour === value),
              ).toHaveLength(2);
            }
            for (const value of minutes) {
              expect(
                options.filter((option) => option.time.minute === value),
              ).toHaveLength(2);
            }
            expect(
              new Set(options.map(({ time }) => `${time.hour}:${time.minute}`))
                .size,
            ).toBe(4);
            expect(
              options.filter((option) => option.kind === "correct"),
            ).toEqual([{ time: { hour, minute }, kind: "correct" }]);
          }
        }
      }
    });

    it("helps with both hands when both the hour and minute are wrong", () => {
      const feedback = explain("hour-and-minute", { hour: 12, minute: 55 });
      expect(feedback).toContain("short hand");
      expect(feedback).toContain("long minute hand");
      expect(feedback).toContain("12:55");
    });
  },
);

it("explains individual ticks for combined mistakes between five-minute marks", () => {
  const feedback = explain("hour-and-minute", { hour: 6, minute: 28 });
  expect(feedback).toContain("short hand");
  expect(feedback).toContain("count the small ticks");
  expect(feedback).not.toContain("Count by fives");
  expect(feedback).toContain("6:28");
});
