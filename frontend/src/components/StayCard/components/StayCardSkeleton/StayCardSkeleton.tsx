import { Skeleton, Card, CardContent, Box } from "@mui/material";
import styles from "./StayCardSkeleton.module.scss";

export const StayCardSkeleton = () => {
  return (
    <Card className={styles.card} aria-hidden="true">
      <Skeleton variant="rectangular" width="100%" height={240} />
      <CardContent className={styles.content}>
        <Skeleton variant="text" className={styles.titleSkeleton} />
        <Skeleton
          variant="text"
          width="80%"
          className={styles.subtitleSkeleton}
        />
        <Skeleton
          variant="text"
          width="60%"
          className={styles.detailSkeleton}
        />
        <Skeleton
          variant="text"
          width="70%"
          className={styles.subtitleSkeleton}
        />
        <Box className={styles.tagRow}>
          <Skeleton variant="rounded" width={50} height={25} />
          <Skeleton variant="rounded" width={50} height={25} />
        </Box>
      </CardContent>
      <Box className={styles.footer}>
        <Skeleton
          variant="text"
          width="40%"
          className={styles.footerTextSkeleton}
        />
        <Skeleton variant="rounded" width="100%" height={36} />
      </Box>
    </Card>
  );
};
