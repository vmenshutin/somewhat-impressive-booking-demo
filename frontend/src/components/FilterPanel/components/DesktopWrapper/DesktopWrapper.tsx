import { Box, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { MINI_DRAWER_WIDTH } from "../../FilterPanel";
import { FilterContent, FilterContentProps } from "../FilterContent";
import styles from "./DesktopWrapper.module.scss";

interface DesktopWrapperProps extends FilterContentProps {
  open: boolean;
  drawerWidth: number;
  onToggle: () => void;
}

export const DesktopWrapper = ({
  open,
  drawerWidth,
  onToggle,
  ...filterContentProps
}: DesktopWrapperProps) => {
  return (
    <Box
      className={styles.desktopDrawer}
      style={{ width: open ? drawerWidth : MINI_DRAWER_WIDTH }}
    >
      {open ? (
        <>
          <Box className={styles.drawerHeader}>
            <Typography variant="h6" className={styles.headerTitle}>
              Filters 🔍
            </Typography>
            <IconButton
              size="large"
              onClick={onToggle}
              aria-label="Close filters"
              className={styles.closeFiltersIconButton}
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
          </Box>
          <Box className={styles.desktopContent}>
            <FilterContent {...filterContentProps} />
          </Box>
        </>
      ) : (
        <Stack
          className={styles.collapsedRail}
          style={{ opacity: open ? 0 : 1 }}
        >
          <Tooltip title="Open filters" placement="right" arrow>
            <IconButton
              size="large"
              onClick={onToggle}
              aria-label="Open filters"
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Box>
  );
};
