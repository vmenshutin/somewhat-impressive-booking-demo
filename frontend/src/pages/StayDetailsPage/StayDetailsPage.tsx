import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
  Stack,
} from "@mui/material";
import { ArrowBack, LocationOn, Star, Home } from "@mui/icons-material";
import { fetchStayDetails } from "../../store/staysSlice";
import { fetchReviews } from "../../store/reviewsSlice";
import { AppDispatch, RootState } from "../../store/store";
import { Reviews, StayCardSkeleton } from "../../components";
import { BookingForm } from "../../components/BookingForm/BookingForm";
import { AvailabilityDateCalendar } from "../../components/AvailabilityDateCalendar/AvailabilityDateCalendar";
import styles from "./StayDetailsPage.module.scss";

export const StayDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedStay: stay, detailsLoading: stayLoading } = useSelector(
    (state: RootState) => state.stays,
  );
  const { filters } = useSelector((state: RootState) => state.stays);
  const { items: reviews, listLoading: reviewsLoading } = useSelector(
    (state: RootState) => state.reviews,
  );
  const [detailsCheckIn, setDetailsCheckIn] = useState(filters.checkIn);
  const [detailsCheckOut, setDetailsCheckOut] = useState(filters.checkOut);

  useEffect(() => {
    if (id) {
      dispatch(fetchStayDetails(id));
      dispatch(fetchReviews(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    setDetailsCheckIn(filters.checkIn);
    setDetailsCheckOut(filters.checkOut);
  }, [id, filters.checkIn, filters.checkOut]);

  if (stayLoading) {
    return (
      <Box className={styles.loadingShell}>
        <Container maxWidth={false}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <StayCardSkeleton />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className={styles.loadingSidebar}>
                <StayCardSkeleton />
                <StayCardSkeleton />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!stay) {
    return (
      <Container maxWidth={false} className={styles.notFoundContainer}>
        <Box className={styles.notFoundContent}>
          <Typography variant="h5" className={styles.notFoundTitle}>
            Stay Not Found
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Back to Stays
          </Button>
        </Box>
      </Container>
    );
  }

  const avgRating = stay.rating;

  return (
    <Box className={styles.pageShell}>
      <Container maxWidth={false}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          className={styles.backButton}
        >
          Back to Stays
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box
              component="img"
              src={stay.image}
              alt={stay.name}
              className={styles.heroImage}
            />

            <Paper className={styles.infoCard}>
              {/*  */}
              <Box className={styles.titleRow}>
                <Box className={styles.titleBlock}>
                  <Typography variant="h4" className={styles.title}>
                    {stay.name}
                  </Typography>
                  <Box className={styles.locationRow}>
                    <LocationOn
                      className={styles.locationIcon}
                      aria-hidden="true"
                    />
                    <Typography variant="body1" color="text.secondary">
                      {stay.location}
                    </Typography>
                  </Box>
                </Box>
                <Box className={styles.ratingSummary}>
                  <Box className={styles.ratingSummaryRow}>
                    <Star
                      className={styles.ratingSummaryIcon}
                      aria-hidden="true"
                    />
                    <Typography
                      variant="h6"
                      className={styles.ratingSummaryValue}
                    >
                      {avgRating}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box className={styles.priceRow}>
                <Box>
                  <Typography variant="h5" className={styles.priceValue}>
                    ${stay.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className={styles.priceLabel}
                  >
                    per night
                  </Typography>
                </Box>
                <Box className={styles.ratingBox}>
                  <Rating value={avgRating} readOnly size="medium" />
                </Box>
              </Box>

              <Box className={styles.descriptionSection}>
                <Typography variant="h6" className={styles.sectionHeading}>
                  <Home className={styles.sectionIcon} aria-hidden="true" />
                  About this place
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  className={styles.descriptionText}
                >
                  {stay.description}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" className={styles.amenitiesHeading}>
                  <span aria-hidden="true">✨</span> Amenities
                </Typography>
                <Box className={styles.amenitiesList}>
                  {stay.amenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      variant="outlined"
                      className={styles.amenityChip}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>

            <Reviews
              stayId={stay.id}
              reviews={reviews}
              reviewsLoading={reviewsLoading}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3} className={styles.bookingSidebar}>
              <AvailabilityDateCalendar
                availability={stay.availability.map((range) => ({
                  start: range.startDate,
                  end: range.endDate,
                }))}
              />

              <BookingForm
                stayId={stay.id}
                stayName={stay.name}
                stayLocation={stay.location}
                pricePerNight={stay.price}
                availability={stay.availability.map((range) => ({
                  start: range.startDate,
                  end: range.endDate,
                }))}
                initialCheckIn={detailsCheckIn}
                initialCheckOut={detailsCheckOut}
                onDatesChange={(checkIn, checkOut) => {
                  setDetailsCheckIn(checkIn);
                  setDetailsCheckOut(checkOut);
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
