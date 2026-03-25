import { Dayjs } from "dayjs";

export interface BookingDetails {
  nights: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

const SERVICE_FEE_RATE = 0.12;

export const calculateBookingDetails = (
  checkIn: Dayjs | null,
  checkOut: Dayjs | null,
  pricePerNight: number,
): BookingDetails | null => {
  if (!checkIn || !checkOut) {
    return null;
  }

  const nights = checkOut.diff(checkIn, "days");

  if (nights <= 0) {
    return null;
  }

  const subtotal = nights * pricePerNight;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
  const total = subtotal + serviceFee;

  return {
    nights,
    subtotal,
    serviceFee,
    total,
  };
};
