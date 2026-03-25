import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { Stay } from "../../store/staysSlice";
import { useNavigate } from "react-router-dom";
import styles from "./StayCard.module.scss";

interface StayCardProps {
  stay: Stay;
}

export const StayCard = ({ stay }: StayCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      role="article"
      aria-label={stay.name}
      className={styles.card}
      onClick={() => navigate(`/stays/${stay.id}`)}
    >
      <CardMedia
        component="img"
        height="240"
        image={stay.image}
        alt={stay.name}
        className={styles.media}
      />
      <CardContent className={styles.cardContent}>
        <Box className={styles.titleRow}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flex: 1, fontWeight: 600 }}
          >
            {stay.name}
          </Typography>
          <Box
            className={styles.ratingBadge}
            aria-label={`${stay.rating} out of 5 stars`}
          >
            <span aria-hidden="true">{stay.rating}⭐</span>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <span aria-hidden="true">📍</span> {stay.location}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.description}
        >
          {stay.description}
        </Typography>

        <Box className={styles.amenitiesBox}>
          {stay.amenities.slice(0, 2).map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              size="small"
              variant="outlined"
              className={styles.chip}
            />
          ))}
          {stay.amenities.length > 2 && (
            <Chip
              label={`+${stay.amenities.length - 2}`}
              size="small"
              variant="outlined"
              className={styles.chipAdditional}
            />
          )}
        </Box>
      </CardContent>
      <CardActions className={styles.cardActions}>
        <Box className={styles.priceBox}>
          <Typography
            variant="h6"
            color="primary.main"
            sx={{ fontWeight: 700 }}
          >
            ${stay.price}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            per night
          </Typography>
        </Box>
        <Button
          size="small"
          variant="contained"
          onClick={() => navigate(`/stays/${stay.id}`)}
          aria-label={`View details for ${stay.name}`}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};
