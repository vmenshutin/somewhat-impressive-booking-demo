import { Box, Typography, Button, Container } from "@mui/material";
import { SearchOff } from "@mui/icons-material";
import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  onReset?: () => void;
  hasDateFilter?: boolean;
}

export const EmptyState = ({
  onReset,
  hasDateFilter = false,
}: EmptyStateProps) => {
  return (
    <Container>
      <Box className={styles.emptyState}>
        <SearchOff className={styles.icon} aria-hidden="true" />
        <Typography variant="h5" className={styles.title}>
          No stays found
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          className={styles.description}
        >
          {hasDateFilter
            ? "No stays are available for your selected dates. Try different dates or adjust other filters."
            : "No stays match your current filters. Try adjusting your criteria or view all available stays."}
        </Typography>
        {onReset && (
          <Button variant="contained" onClick={onReset}>
            Clear Filters
          </Button>
        )}
      </Box>
    </Container>
  );
};
