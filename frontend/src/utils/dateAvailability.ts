export interface AvailabilityRange {
  start: string;
  end: string;
}

const parseISODateString = (value: string): Date | null => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const startOfDay = (value: Date): number =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

export const isDateAvailable = (
  date: Date,
  availabilityRanges: AvailabilityRange[],
): boolean => {
  const targetTime = startOfDay(date);

  return availabilityRanges.some((range) => {
    const startDate = parseISODateString(range.start);
    const endDate = parseISODateString(range.end);

    if (!startDate || !endDate) {
      return false;
    }

    const startTime = startOfDay(startDate);
    const endTime = startOfDay(endDate);

    return startTime <= targetTime && targetTime <= endTime;
  });
};
