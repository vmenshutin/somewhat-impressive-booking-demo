import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { ExpandMore, ArrowBack } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { createBooking } from "../../store/bookingSlice";
import {
  ContactSection,
  type ContactValues,
} from "./components/ContactSection/ContactSection";
import {
  AddressSection,
  type AddressValues,
} from "./components/AddressSection/AddressSection";
import {
  CardSection,
  type CardValues,
} from "./components/CardSection/CardSection";
import { BookingSummary } from "./components/BookingSummary/BookingSummary";
import styles from "./CheckoutPage.module.scss";

interface CheckoutState {
  stayId: string;
  stayName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
}

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const booking = location.state as CheckoutState | undefined;

  const [expandedSection, setExpandedSection] = useState<number>(0);
  const [isPaying, setIsPaying] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [contactState, setContactState] = useState<{
    values: ContactValues;
    isValid: boolean;
  }>({
    values: { firstName: "", lastName: "", email: "" },
    isValid: false,
  });
  const [addressState, setAddressState] = useState<{
    values: AddressValues;
    isValid: boolean;
  }>({
    values: { street: "", city: "", state: "", zipCode: "", country: "" },
    isValid: false,
  });
  const [cardState, setCardState] = useState<{
    values: CardValues;
    normalizedNumber: string;
    isValid: boolean;
  }>({
    values: { cardNumber: "", expiry: "", cvv: "" },
    normalizedNumber: "",
    isValid: false,
  });

  const canPay = useMemo(
    () =>
      !!booking &&
      contactState.isValid &&
      addressState.isValid &&
      cardState.isValid,
    [booking, contactState.isValid, addressState.isValid, cardState.isValid],
  );

  const handleContactChange = useCallback(
    (values: ContactValues, isValid: boolean) => {
      setContactState({ values, isValid });
    },
    [],
  );

  const handleAddressChange = useCallback(
    (values: AddressValues, isValid: boolean) => {
      setAddressState({ values, isValid });
    },
    [],
  );

  const handleCardChange = useCallback(
    (values: CardValues, normalizedNumber: string, isValid: boolean) => {
      setCardState({ values, normalizedNumber, isValid });
    },
    [],
  );

  useEffect(() => {
    if (expandedSection >= 1 && !contactState.isValid) {
      setExpandedSection(0);
      return;
    }
    if (expandedSection >= 2 && !addressState.isValid) {
      setExpandedSection(1);
    }
  }, [expandedSection, contactState.isValid, addressState.isValid]);

  const handlePay = async () => {
    if (!booking || !canPay) return;
    setIsPaying(true);
    setSubmitError("");

    try {
      const createdBooking = await dispatch(
        createBooking({
          stayId: booking.stayId,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: 1,
          firstName: contactState.values.firstName.trim(),
          lastName: contactState.values.lastName.trim(),
          email: contactState.values.email.trim(),
          street: addressState.values.street.trim(),
          city: addressState.values.city.trim(),
          state: addressState.values.state.trim(),
          zipCode: addressState.values.zipCode.trim(),
          country: addressState.values.country.trim(),
          cardNumber: cardState.normalizedNumber,
          expiry: cardState.values.expiry.trim(),
          cvv: cardState.values.cvv.trim(),
        }),
      ).unwrap();

      navigate("/confirmation", {
        state: {
          confirmationId: createdBooking.confirmationId || "N/A",
          bookingSummary: {
            stayName: booking.stayName,
            location: booking.location,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            nights: booking.nights,
            totalPrice: booking.totalPrice,
          },
        },
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Checkout failed. Please try again.",
      );
    } finally {
      setIsPaying(false);
    }
  };

  if (!booking) {
    return (
      <Container maxWidth={false} className={styles.pageShell}>
        <Alert severity="warning">
          No booking details found. Please start from a stay details page.
        </Alert>
        <Box mt={2}>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
          >
            Back to Stays
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box className={styles.pageShell}>
      <Container maxWidth={false}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>

        <Grid container spacing={3} className={styles.contentGrid}>
          <Grid item xs={12} md={7}>
            <Paper className={styles.formCard}>
              <Typography variant="h5" gutterBottom>
                Checkout
              </Typography>

              <Accordion
                expanded={expandedSection === 0}
                onChange={() => setExpandedSection(0)}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>1. Contact Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ContactSection
                    onValidChange={handleContactChange}
                    onContinue={() => setExpandedSection(1)}
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedSection === 1}
                onChange={() => {
                  if (contactState.isValid) setExpandedSection(1);
                }}
                disabled={!contactState.isValid}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>2. Address</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <AddressSection
                    onValidChange={handleAddressChange}
                    onContinue={() => setExpandedSection(2)}
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedSection === 2}
                onChange={() => {
                  if (addressState.isValid) setExpandedSection(2);
                }}
                disabled={!addressState.isValid}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>3. Card Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <CardSection onValidChange={handleCardChange} />
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <BookingSummary
              stayName={booking.stayName}
              location={booking.location}
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              nights={booking.nights}
              totalPrice={booking.totalPrice}
              canPay={canPay}
              isPaying={isPaying}
              submitError={submitError}
              onPay={handlePay}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
