export function calculateDday(dateValue, today = new Date()) {
  if (!dateValue) {
    throw new Error("시험 날짜를 선택하세요.");
  }

  const current = new Date(today);
  current.setHours(0, 0, 0, 0);
  const target = new Date(`${dateValue}T00:00:00`);
  const days = Math.round((target - current) / 86400000);

  return days;
}
