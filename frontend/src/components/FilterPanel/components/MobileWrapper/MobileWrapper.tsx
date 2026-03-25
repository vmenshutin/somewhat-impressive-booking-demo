import { Box, Typography, SwipeableDrawer } from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import { FilterContent, FilterContentProps } from "../FilterContent";
import styles from "./MobileWrapper.module.scss";

type MobileWrapperProps = FilterContentProps;

export const MobileWrapper = ({
  onApply,
  onReset,
  ...rest
}: MobileWrapperProps) => {
  const [open, setOpen] = useState(false);

  const handleApply = useCallback(() => {
    onApply();
    setOpen(false);
  }, [onApply]);

  const handleReset = useCallback(() => {
    onReset();
    setOpen(false);
  }, [onReset]);

  const swipeHandle = useMemo(
    () => (
      <Box
        role="button"
        tabIndex={open ? -1 : 0}
        aria-label="Open filters"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={styles.swipeHandleTrigger}
        style={{ opacity: open ? 0 : 1, pointerEvents: open ? "none" : "auto" }}
      >
        <Box className={styles.swipeHandleBar} />
        <Typography variant="caption" className={styles.swipeHandleText}>
          Swipe up to filter
        </Typography>
      </Box>
    ),
    [open],
  );

  return (
    <>
      {swipeHandle}

      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        disableSwipeToOpen={false}
        disableDiscovery={false}
        swipeAreaWidth={50}
        className={styles.mobileDrawer}
        aria-label="Filters"
      >
        <Box className={styles.mobileDrawerHandleWrap}>
          <Box className={styles.mobileDrawerHandle} />
        </Box>
        <Box className={styles.mobileDrawerContent}>
          <FilterContent
            {...rest}
            onApply={handleApply}
            onReset={handleReset}
          />
        </Box>
      </SwipeableDrawer>
    </>
  );
};
