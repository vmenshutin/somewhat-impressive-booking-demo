import { Card, CardContent, Typography, Rating, Box } from "@mui/material";
import { Review } from "../../../../store/reviewsSlice";
import styles from "./ReviewCard.module.scss";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card
      className={styles.card}
      role="article"
      aria-label={`Review by ${review.author}`}
    >
      <CardContent>
        <Box className={styles.header}>
          <Box>
            <Typography variant="h6">{review.author}</Typography>
            <Typography variant="body2" color="text.secondary">
              {review.date}
            </Typography>
          </Box>
          <Rating
            value={review.rating}
            readOnly
            aria-label={`${review.rating} out of 5 stars`}
          />
        </Box>
        <Typography variant="body1">{review.comment}</Typography>
      </CardContent>
    </Card>
  );
};
