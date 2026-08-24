export function parseStudyDurations(raw) {
  const items = raw.split(",").map((value) => value.trim()).filter(Boolean);

  if (!items.length) {
    throw new Error("공부시간을 입력하세요.");
  }

  return items.map((item) => {
    const match = item.match(/^(\d+):([0-5]\d)$/);

    if (!match) {
      throw new Error("형식은 1:30, 2:20처럼 입력하세요.");
    }

    return Number(match[1]) * 60 + Number(match[2]);
  });
}

export function calculateStudyMinutes(durations) {
  return durations.reduce((total, duration) => total + duration, 0);
}

export function calculateAvailableStudyHours(days, hoursPerDay) {
  if (!Number.isInteger(days) || days <= 0 || !Number.isFinite(hoursPerDay) || hoursPerDay < 0 || hoursPerDay > 24) {
    throw new Error("남은 일수는 1일 이상 정수, 하루 공부시간은 0~24시간으로 입력하세요.");
  }

  return days * hoursPerDay;
}
