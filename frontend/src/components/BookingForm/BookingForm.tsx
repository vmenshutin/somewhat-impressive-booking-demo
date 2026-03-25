import { Box, Button, Paper, Typography } from "@mui/material";
import { FormEvent, useState, useMemo, useCallback } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import {
  AvailabilityRange,
  isDateAvailable,
} from "../../utils/dateAvailability";
import { calculateBookingDetails } from "../../utils/bookingDetails";
import { PriceBreakdown } from "./components/PriceBreakdown";
import { isRangeFullyAvailable } from "../../utils/rangeAvailability";
import styles from "./BookingForm.module.scss";
import { DATE_PICKER_SLOT_PROPS } from "../../utils/constants";

const slotProps = {
  ...DATE_PICKER_SLOT_PROPS,
  className: styles.datePickerField,
};

interface BookingFormProps {
  stayId: string;
  stayName: string;
  stayLocation: string;
  pricePerNight: number;
  availability: AvailabilityRange[];
  initialCheckIn?: Dayjs | null;
  initialCheckOut?: Dayjs | null;
  onDatesChange?: (checkIn: Dayjs, checkOut: Dayjs) => void;
}

export const BookingForm = ({
  stayId,
  stayName,
  stayLocation,
  pricePerNight,
  availability,
  initialCheckIn,
  initialCheckOut,
  onDatesChange,
}: BookingFormProps) => {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState<Dayjs | null>(initialCheckIn || null);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(
    initialCheckOut || null,
  );

  useEffect(() => {
    if (checkIn && checkOut) {
      onDatesChange?.(checkIn, checkOut);
    }
  }, [checkIn, checkOut, onDatesChange]);

  const bookingDetails = useMemo(
    () => calculateBookingDetails(checkIn, checkOut, pricePerNight),
    [checkIn, checkOut, pricePerNight],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!checkIn || !checkOut || !bookingDetails) return;

      navigate("/checkout", {
        state: {
          stayId,
          stayName,
          location: stayLocation,
          checkIn: checkIn.format("YYYY-MM-DD"),
          checkOut: checkOut.format("YYYY-MM-DD"),
          nights: bookingDetails.nights,
          totalPrice: bookingDetails.total,
        },
      });
    },
    [
      bookingDetails,
      checkIn,
      checkOut,
      navigate,
      stayId,
      stayLocation,
      stayName,
    ],
  );

  const handleResetDates = useCallback(() => {
    setCheckIn(null);
    setCheckOut(null);
  }, []);

  // Booking Form
  return (
    <Paper className={styles.bookingCard}>
      <Typography variant="h6" className={styles.bookingTitle}>
        <span aria-hidden="true">🏷️</span> Reserve Now
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        className={styles.bookingSubtitle}
      >
        Check availability and complete your booking
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <DatePicker
          label="Check-in"
          value={checkIn}
          onChange={(date: Dayjs | null) => {
            setCheckIn(date);
            setCheckOut(date ? dayjs(date).add(1, "day") : null);
          }}
          shouldDisableDate={(date) => {
            const today = dayjs().startOf("day");
            // if the date is in the past, disable it
            if (date.isBefore(today)) {
              return true;
            }
            // if the date is not available, disable it
            if (!isDateAvailable(date.toDate(), availability)) {
              return true;
            }
            return false;
          }}
          slotProps={{ textField: slotProps }}
        />

        <DatePicker
          label="Check-out"
          value={checkOut}
          onChange={(date: Dayjs | null) => {
            setCheckOut(date);
          }}
          disabled={!checkIn}
          referenceDate={checkOut || undefined}
          shouldDisableDate={(date) => {
            // if it is the next day after check-in, allow it (for 1-night stays)
            if (checkIn && date.isSame(checkIn.add(1, "day"), "day")) {
              return false;
            }
            // if the date is before or the same as check-in, disable it
            if (!date.isAfter(checkIn, "day")) {
              return true;
            }
            // if the date is not available, disable it
            if (!isDateAvailable(date.toDate(), availability)) {
              return true;
            }
            // if the range from check-in to this date is not fully available, disable it
            return !isRangeFullyAvailable(checkIn, date, availability);
          }}
          slotProps={{ textField: slotProps }}
        />

        <Button
          fullWidth
          variant="text"
          onClick={handleResetDates}
          disabled={!checkIn && !checkOut}
        >
          Reset Dates
        </Button>

        {bookingDetails && (
          <PriceBreakdown
            bookingDetails={bookingDetails}
            pricePerNight={pricePerNight}
          />
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={styles.submitButton}
          disabled={!checkIn || !checkOut || !bookingDetails}
        >
          {`Book Now - $${bookingDetails?.total || "0"}`}
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          className={styles.paymentNote}
        >
          <span aria-hidden="true">✓</span> No payment required yet
        </Typography>
      </Box>
    </Paper>
  );
};
