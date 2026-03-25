import { Alert, Box, Paper, Typography } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useMemo } from "react";
import { Dayjs } from "dayjs";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import {
  AvailabilityRange,
  isDateAvailable,
} from "../../utils/dateAvailability";
import styles from "./AvailabilityDateCalendar.module.scss";

interface AvailabilityDateCalendarProps {
  availability: AvailabilityRange[];
}

export const AvailabilityDateCalendar = ({
  availability,
}: AvailabilityDateCalendarProps) => {
  const hasAvailability = availability.length > 0;

  const AvailabilityDay = useMemo(
    () =>
      function AvailabilityDaySlot(props: PickersDayProps<Dayjs>) {
        const { day, disabled, outsideCurrentMonth, ...other } = props;
        const available = isDateAvailable(day.toDate(), availability);
        const dayClassName = [
          styles.calendarDay,
          available ? styles.availableDay : styles.unavailableDay,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <PickersDay
            {...other}
            day={day}
            selected={false}
            disabled={disabled || !available}
            outsideCurrentMonth={outsideCurrentMonth}
            className={dayClassName}
          />
        );
      },
    [availability],
  );

  return (
    <Paper className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Availability
      </Typography>

      <Box className={styles.legend}>
        <Box className={styles.legendItem}>
          <Box
            className={`${styles.legendDot} ${styles.availableDot}`}
            aria-hidden="true"
          />
          <Typography variant="caption" color="text.secondary">
            Available dates
          </Typography>
        </Box>

        <Box className={styles.legendItem}>
          <Box
            className={`${styles.legendDot} ${styles.unavailableDot}`}
            aria-hidden="true"
          />
          <Typography variant="caption" color="text.secondary">
            Unavailable dates
          </Typography>
        </Box>
      </Box>

      {!hasAvailability && (
        <Alert severity="info" className={styles.emptyAlert}>
          No availability is currently set for this stay.
        </Alert>
      )}

      <DateCalendar
        value={null}
        readOnly
        shouldDisableDate={(date: Dayjs) =>
          !isDateAvailable(date.toDate(), availability)
        }
        slots={{ day: AvailabilityDay }}
        disabled={!hasAvailability}
        className={styles.calendar}
      />
    </Paper>
  );
};
