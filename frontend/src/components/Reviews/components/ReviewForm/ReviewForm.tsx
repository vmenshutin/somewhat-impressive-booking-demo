import {
  Box,
  TextField,
  Button,
  Rating,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { FormEvent, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addReview,
  addReviewOptimistic,
  removeReviewOptimistic,
  clearAddingError,
} from "../../../../store/reviewsSlice";
import { AppDispatch, RootState } from "../../../../store/store";
import styles from "./ReviewForm.module.scss";

interface ReviewFormProps {
  stayId: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({ stayId, onSuccess }: ReviewFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addingLoading, addingError } = useSelector(
    (state: RootState) => state.reviews,
  );

  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!author.trim() || !comment.trim()) {
        return;
      }

      const optimisticId = `temp-${Date.now()}`;
      const today = new Date().toISOString().split("T")[0];

      const optimisticReview = {
        id: optimisticId,
        stayId,
        author: author.trim(),
        rating,
        comment: comment.trim(),
        date: today,
      };

      dispatch(
        addReviewOptimistic({
          review: optimisticReview,
          optimisticId,
        }),
      );

      dispatch(clearAddingError());

      setAuthor("");
      setRating(5);
      setComment("");

      try {
        const result = await dispatch(
          addReview({
            stayId,
            author: optimisticReview.author,
            rating,
            comment: optimisticReview.comment,
          }),
        );

        if (result.meta.requestStatus === "fulfilled") {
          onSuccess?.();
        } else if (result.meta.requestStatus === "rejected") {
          dispatch(removeReviewOptimistic(optimisticId));
        }
      } catch {
        dispatch(removeReviewOptimistic(optimisticId));
      }
    },
    [author, comment, dispatch, onSuccess, rating, stayId],
  );

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Your Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="e.g., John Doe"
        margin="normal"
        size="small"
        required
        disabled={addingLoading}
      />

      <Box className={styles.ratingSection}>
        <Typography variant="subtitle2" className={styles.ratingLabel}>
          Your Rating
        </Typography>
        <Rating
          value={rating}
          onChange={(_, value) => setRating(value || 5)}
          size="large"
          disabled={addingLoading}
          aria-label="Your rating"
        />
      </Box>

      <TextField
        fullWidth
        label="Your Review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this stay..."
        multiline
        rows={4}
        margin="normal"
        size="small"
        required
        disabled={addingLoading}
      />

      {addingError && (
        <Alert
          severity="error"
          className={styles.errorAlert}
          onClose={() => dispatch(clearAddingError())}
        >
          {addingError}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        className={styles.submitButton}
        disabled={addingLoading || !author.trim() || !comment.trim()}
        size="large"
      >
        {addingLoading ? (
          <Box className={styles.loadingContent}>
            <CircularProgress size={20} />
            Posting...
          </Box>
        ) : (
          "Post Review"
        )}
      </Button>
    </Box>
  );
};
