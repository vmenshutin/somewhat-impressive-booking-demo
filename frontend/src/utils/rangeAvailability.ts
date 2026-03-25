import { Dayjs } from "dayjs";
import { AvailabilityRange, isDateAvailable } from "./dateAvailability";

export const isRangeFullyAvailable = (
  start: Dayjs | null,
  end: Dayjs | null,
  availability: AvailabilityRange[],
): boolean => {
  if (!start || !end) return false;

  let cursor = start.startOf("day");
  const endDate = end.startOf("day");

  while (cursor.isBefore(endDate) || cursor.isSame(endDate, "day")) {
    if (!isDateAvailable(cursor.toDate(), availability)) {
      return false;
    }
    cursor = cursor.add(1, "day");
  }

  return true;
};
