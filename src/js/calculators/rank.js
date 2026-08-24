export function calculateRankPercentile(rank, total) {
  if (!Number.isInteger(rank) || rank <= 0 || !Number.isInteger(total) || total <= 0 || rank > total) {
    throw new Error("석차와 전체 인원을 양의 정수로 입력하고, 석차가 전체 인원을 넘지 않게 해주세요.");
  }

  return (rank / total) * 100;
}

export function getRankGrade(percentile, system) {
  if (system === 5) {
    return percentile <= 10 ? 1 : percentile <= 34 ? 2 : percentile <= 66 ? 3 : percentile <= 90 ? 4 : 5;
  }

  if (system === 9) {
    return percentile <= 4 ? 1 : percentile <= 11 ? 2 : percentile <= 23 ? 3 : percentile <= 40 ? 4 : percentile <= 60 ? 5 : percentile <= 77 ? 6 : percentile <= 89 ? 7 : percentile <= 96 ? 8 : 9;
  }

  return null;
}
