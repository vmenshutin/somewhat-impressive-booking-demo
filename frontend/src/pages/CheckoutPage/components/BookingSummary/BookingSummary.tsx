import { Alert, Box, Button, Divider, Paper, Typography } from "@mui/material";
import styles from "./BookingSummary.module.scss";

interface BookingSummaryProps {
  stayName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  canPay: boolean;
  isPaying: boolean;
  submitError: string;
  onPay: () => void;
}

export const BookingSummary = ({
  stayName,
  location,
  checkIn,
  checkOut,
  nights,
  totalPrice,
  canPay,
  isPaying,
  submitError,
  onPay,
}: BookingSummaryProps) => (
  <Paper className={styles.summaryCard}>
    <Typography variant="h6" className={styles.summaryTitle}>
      Booking Summary
    </Typography>

    <Box className={styles.summaryRow}>
      <Typography color="text.secondary">Hotel</Typography>
      <Typography className={styles.summaryValue}>{stayName}</Typography>
    </Box>

    <Box className={styles.summaryRow}>
      <Typography color="text.secondary">Location</Typography>
      <Typography className={styles.summaryValue}>{location}</Typography>
    </Box>

    <Box className={styles.summaryRow}>
      <Typography color="text.secondary">Check-in</Typography>
      <Typography className={styles.summaryValue}>{checkIn}</Typography>
    </Box>

    <Box className={styles.summaryRow}>
      <Typography color="text.secondary">Check-out</Typography>
      <Typography className={styles.summaryValue}>{checkOut}</Typography>
    </Box>

    <Box className={styles.summaryRow}>
      <Typography color="text.secondary">Nights</Typography>
      <Typography className={styles.summaryValue}>{nights}</Typography>
    </Box>

    <Divider sx={{ my: 1.5 }} />

    <Box className={styles.summaryRow}>
      <Typography className={styles.totalLabel}>Total</Typography>
      <Typography className={styles.totalValue}>${totalPrice}</Typography>
    </Box>

    <Button
      fullWidth
      variant="contained"
      sx={{ mt: 2 }}
      disabled={!canPay || isPaying}
      onClick={onPay}
    >
      {isPaying ? "Processing..." : `Pay $${totalPrice}`}
    </Button>

    {submitError && (
      <Alert severity="error" sx={{ mt: 1.5 }}>
        {submitError}
      </Alert>
    )}
  </Paper>
);
