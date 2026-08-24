export function isValidScore(value) {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

export function parseScoreList(raw) {
  const parts = raw.trim() ? raw.split(",").map((value) => value.trim()) : [];
  const scores = parts.map(Number);

  if (!parts.length || parts.some((part, index) => !part || !isValidScore(scores[index]))) {
    throw new Error("0~100점 사이의 점수를 쉼표로 구분해 입력하세요.");
  }

  return scores;
}

export function calculateAverage(scores) {
  if (!scores.length || scores.some((score) => !isValidScore(score))) {
    throw new Error("평균을 계산할 점수가 없습니다.");
  }

  return scores.reduce((total, score) => total + score, 0) / scores.length;
}

export function calculatePerformanceScore(examScore, examWeight, taskScore, taskWeight) {
  if (!isValidScore(examScore) || !isValidScore(taskScore)) {
    throw new Error("점수는 0~100점으로 입력하세요.");
  }

  if (![examWeight, taskWeight].every((value) => Number.isFinite(value) && value >= 0 && value <= 100)) {
    throw new Error("반영비율은 0~100%로 입력하세요.");
  }

  if (Math.abs(examWeight + taskWeight - 100) > Number.EPSILON) {
    throw new Error("시험과 수행평가 반영비율 합계가 100%가 되게 입력하세요.");
  }

  return (examScore * examWeight + taskScore * taskWeight) / 100;
}

export function calculateGoalScore(currentScore, nextWeight, targetScore) {
  if (!isValidScore(currentScore) || !isValidScore(targetScore)) {
    throw new Error("현재 점수와 목표 점수는 0~100점으로 입력하세요.");
  }

  if (!Number.isFinite(nextWeight) || nextWeight <= 0 || nextWeight > 100) {
    throw new Error("다음 시험 반영비율은 1~100%로 입력하세요.");
  }

  return (targetScore - currentScore * (1 - nextWeight / 100)) / (nextWeight / 100);
}

export function calculateWeightedAverage(subjects) {
  if (!subjects.length || subjects.some(({ score, weight }) => !isValidScore(score) || !Number.isFinite(weight) || weight <= 0)) {
    throw new Error("과목의 점수와 가중치를 올바르게 입력하세요.");
  }

  const totalWeight = subjects.reduce((total, subject) => total + subject.weight, 0);
  return subjects.reduce((total, subject) => total + subject.score * subject.weight, 0) / totalWeight;
}

export function getScoreGrade(score, system) {
  if (system === 5) {
    return score >= 90 ? 1 : score >= 80 ? 2 : score >= 70 ? 3 : score >= 60 ? 4 : 5;
  }

  if (system === 9) {
    return score >= 90 ? 1 : score >= 80 ? 2 : score >= 70 ? 3 : score >= 60 ? 4 : score >= 50 ? 5 : score >= 40 ? 6 : score >= 30 ? 7 : score >= 20 ? 8 : 9;
  }

  return null;
}
