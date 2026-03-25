import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { BookingDetails } from "../../../../utils/bookingDetails";
import styles from "./PriceBreakdown.module.scss";

interface PriceBreakdownProps {
  bookingDetails: BookingDetails;
  pricePerNight: number;
}

export const PriceBreakdown = ({
  bookingDetails,
  pricePerNight,
}: PriceBreakdownProps) => {
  return (
    <Paper className={styles.priceBreakdown}>
      <Typography variant="subtitle2" className={styles.priceBreakdownTitle}>
        Price Breakdown
      </Typography>

      <Stack spacing={1} className={styles.priceBreakdownStack}>
        <Box className={styles.priceRow}>
          <Typography variant="body2" color="text.secondary">
            ${pricePerNight} × {bookingDetails.nights}{" "}
            {bookingDetails.nights === 1 ? "night" : "nights"}
          </Typography>
          <Typography variant="body2" className={styles.priceValue}>
            ${bookingDetails.subtotal}
          </Typography>
        </Box>

        <Box className={styles.priceRow}>
          <Typography variant="body2" color="text.secondary">
            Service fee (12%)
          </Typography>
          <Typography variant="body2" className={styles.priceValue}>
            ${bookingDetails.serviceFee}
          </Typography>
        </Box>

        <Divider className={styles.priceDivider} />

        <Box className={styles.priceRow}>
          <Typography variant="subtitle2" className={styles.priceTotalLabel}>
            Total
          </Typography>
          <Typography variant="h6" className={styles.priceTotalValue}>
            ${bookingDetails.total}
          </Typography>
        </Box>
      </Stack>

      <Chip
        label={`${bookingDetails.nights} ${bookingDetails.nights === 1 ? "Night" : "Nights"}`}
        size="small"
        variant="outlined"
        className={styles.nightsChip}
      />
    </Paper>
  );
};
