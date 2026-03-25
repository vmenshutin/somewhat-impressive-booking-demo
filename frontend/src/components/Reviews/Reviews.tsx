import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Review } from "../../store/reviewsSlice";
import { ReviewCard } from "./components/ReviewCard";
import { ReviewForm } from "./components/ReviewForm";
import styles from "./Reviews.module.scss";

interface ReviewsProps {
  stayId: string;
  reviews: Review[];
  reviewsLoading: boolean;
}

export const Reviews = ({ stayId, reviews, reviewsLoading }: ReviewsProps) => {
  return (
    <Paper className={styles.reviewsCard}>
      <Typography variant="h5" className={styles.reviewsTitle}>
        <span aria-hidden="true">💬</span> Guest Reviews
      </Typography>

      {reviewsLoading ? (
        <Box
          className={styles.reviewsLoading}
          role="status"
          aria-label="Loading reviews"
        >
          <CircularProgress aria-hidden="true" />
        </Box>
      ) : reviews.length > 0 ? (
        <Box className={styles.reviewsList}>
          <Stack spacing={2}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </Stack>
        </Box>
      ) : (
        <Alert severity="info" className={styles.reviewsEmptyAlert}>
          📝 No reviews yet. Be the first to share your experience!
        </Alert>
      )}

      <Box>
        <Typography variant="h6" className={styles.reviewFormTitle}>
          Share Your Experience
        </Typography>
        <ReviewForm stayId={stayId} />
      </Box>
    </Paper>
  );
};
