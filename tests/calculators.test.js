import { describe, expect, it } from "vitest";
import { calculateDday } from "../src/js/calculators/date.js";
import { calculateRankPercentile, getRankGrade } from "../src/js/calculators/rank.js";
import { calculateAverage, calculateGoalScore, calculatePerformanceScore, calculateWeightedAverage, parseScoreList } from "../src/js/calculators/score.js";
import { calculateNeisBytes, countCharacters } from "../src/js/calculators/text.js";
import { calculateAvailableStudyHours, calculateStudyMinutes, parseStudyDurations } from "../src/js/calculators/time.js";
import { formatTimerSeconds, TIMER_DURATION_SECONDS } from "../src/js/calculators/timer.js";

describe("score calculators", () => {
  it("calculates a score average", () => {
    expect(calculateAverage(parseScoreList("87, 92, 76"))).toBeCloseTo(85);
  });

  it("rejects scores outside the allowed range", () => {
    expect(() => parseScoreList("101, 90")).toThrow();
  });

  it("calculates a weighted average", () => {
    expect(calculateWeightedAverage([
      { name: "국어", score: 90, weight: 2 },
      { name: "수학", score: 80, weight: 1 }
    ])).toBeCloseTo(86.6667, 3);
  });

  it("calculates performance and goal scores", () => {
    expect(calculatePerformanceScore(80, 60, 100, 40)).toBe(88);
    expect(calculateGoalScore(80, 40, 90)).toBe(105);
  });
});

describe("rank calculators", () => {
  it("calculates percentile and rank grade", () => {
    expect(calculateRankPercentile(12, 120)).toBe(10);
    expect(getRankGrade(10, 5)).toBe(1);
    expect(getRankGrade(10, 9)).toBe(2);
  });

  it("rejects impossible ranks", () => {
    expect(() => calculateRankPercentile(121, 120)).toThrow();
  });
});

describe("text calculators", () => {
  it("counts Unicode characters with and without whitespace", () => {
    expect(countCharacters("가나 A")).toEqual({ withWhitespace: 4, withoutWhitespace: 3 });
  });

  it("uses the project NEIS byte rule", () => {
    expect(calculateNeisBytes("가A ")).toBe(5);
  });
});

describe("time and date calculators", () => {
  it("adds study durations", () => {
    expect(calculateStudyMinutes(parseStudyDurations("1:30, 2:20, 0:45"))).toBe(275);
    expect(calculateAvailableStudyHours(5, 2.5)).toBe(12.5);
  });

  it("calculates a D-Day from a fixed date", () => {
    expect(calculateDday("2026-08-30", new Date("2026-08-24T12:00:00"))).toBe(6);
  });

  it("formats the default timer duration", () => {
    expect(TIMER_DURATION_SECONDS).toBe(1500);
    expect(formatTimerSeconds(TIMER_DURATION_SECONDS)).toBe("25:00");
    expect(formatTimerSeconds(65)).toBe("01:05");
  });
});
