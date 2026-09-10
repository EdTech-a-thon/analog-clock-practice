import { describe, expect, it } from "vitest";
import { handAngles } from "./angles";

describe("handAngles", () => {
  it("puts both hands straight up at twelve o'clock", () => {
    expect(handAngles({ hour: 12, minute: 0 })).toEqual({ hour: 0, minute: 0 });
  });

  it("puts the hour hand on the numeral when the minute hand is at twelve", () => {
    expect(handAngles({ hour: 3, minute: 0 })).toEqual({ hour: 90, minute: 0 });
  });

  it("carries the hour hand three quarters of the way to the next numeral at quarter to", () => {
    expect(handAngles({ hour: 3, minute: 45 })).toEqual({
      hour: 112.5,
      minute: 270,
    });
  });

  it("carries the hour hand halfway to the next numeral at half past", () => {
    expect(handAngles({ hour: 6, minute: 30 })).toEqual({
      hour: 195,
      minute: 180,
    });
  });

  it("wraps twelve to the top rather than past it", () => {
    expect(handAngles({ hour: 12, minute: 30 })).toEqual({
      hour: 15,
      minute: 180,
    });
  });
});
