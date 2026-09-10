import type { ClockTime } from "./types";

/**
 * Rotations in degrees clockwise from twelve for both hands.
 *
 * The hour hand moves proportionally through the hour rather than jumping
 * between numerals: at 3:45 it sits three quarters of the way from the 3 to the
 * 4. Getting this wrong would teach the Hour Slip this tool exists to correct.
 */
export function handAngles(time: ClockTime): { hour: number; minute: number } {
  return {
    hour: ((time.hour % 12) + time.minute / 60) * 30,
    minute: time.minute * 6,
  };
}
