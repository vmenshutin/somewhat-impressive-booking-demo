import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import styles from "./ConfirmationPage.module.scss";

interface BookingSummary {
  stayName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
}

interface ConfirmationState {
  confirmationId: string;
  bookingSummary?: BookingSummary;
}

export const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ConfirmationState | undefined;

  if (!state?.confirmationId) {
    return (
      <Container maxWidth={false} className={styles.pageShell}>
        <Alert severity="warning">No confirmation details found.</Alert>
        <Box mt={2}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Back to Stays
          </Button>
        </Box>
      </Container>
    );
  }

  const summary = state.bookingSummary;

  return (
    <Box className={styles.pageShell}>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper className={styles.successCard}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
              >
                <CheckCircle color="success" />
                <Typography variant="h5" className={styles.successTitle}>
                  Booking Confirmed
                </Typography>
              </Box>

              <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                Your payment was successful and your reservation is confirmed.
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Confirmation ID
              </Typography>
              <Typography variant="h6" className={styles.confirmationId}>
                {state.confirmationId}
              </Typography>

              <Box className={styles.actionsRow}>
                <Button variant="contained" onClick={() => navigate("/")}>
                  Back to Stays
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            {summary && (
              <Paper className={styles.summaryCard}>
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
                  Booking Summary
                </Typography>

                <Box className={styles.summaryRow}>
                  <Typography color="text.secondary">Hotel</Typography>
                  <Typography className={styles.summaryValue}>
                    {summary.stayName}
                  </Typography>
                </Box>

                <Box className={styles.summaryRow}>
                  <Typography color="text.secondary">Location</Typography>
                  <Typography className={styles.summaryValue}>
                    {summary.location}
                  </Typography>
                </Box>

                <Box className={styles.summaryRow}>
                  <Typography color="text.secondary">Check-in</Typography>
                  <Typography className={styles.summaryValue}>
                    {summary.checkIn}
                  </Typography>
                </Box>

                <Box className={styles.summaryRow}>
                  <Typography color="text.secondary">Check-out</Typography>
                  <Typography className={styles.summaryValue}>
                    {summary.checkOut}
                  </Typography>
                </Box>

                <Box className={styles.summaryRow}>
                  <Typography color="text.secondary">Nights</Typography>
                  <Typography className={styles.summaryValue}>
                    {summary.nights}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} aria-hidden="true" />

                <Box className={styles.summaryRow}>
                  <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    ${summary.totalPrice}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
