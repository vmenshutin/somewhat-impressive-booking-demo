import { useMediaQuery, useTheme } from "@mui/material";
import { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { FiltersState, setFilters } from "../../store/staysSlice";
import { shallowCompare } from "../../utils/shallowCompare";
import { DesktopWrapper } from "./components/DesktopWrapper";
import { MobileWrapper } from "./components/MobileWrapper";

export const MINI_DRAWER_WIDTH = 24;
export const MAXI_DRAWER_WIDTH = 300;

const defaultFilters: FiltersState = {
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  location: "",
  checkIn: null,
  checkOut: null,
};

interface FilterPanelProps {
  onApplyFilters: (filtersToApply?: FiltersState) => void;
  desktopOpen: boolean;
  onToggleDesktop: () => void;
  drawerWidth?: number;
}

export const FilterPanel = ({
  onApplyFilters,
  desktopOpen,
  onToggleDesktop,
  drawerWidth = MAXI_DRAWER_WIDTH,
}: FilterPanelProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.stays.filters);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [lastAppliedFilters, setLastAppliedFilters] = useState(filters);

  const hasChanges = useMemo(
    () => !shallowCompare(filters, lastAppliedFilters),
    [filters, lastAppliedFilters],
  );

  const isDefaultFilters = useMemo(
    () => shallowCompare(filters, defaultFilters),
    [filters],
  );

  const handleApply = useCallback(() => {
    if (!hasChanges) return;
    onApplyFilters(filters);
    setLastAppliedFilters(filters);
  }, [hasChanges, onApplyFilters, filters]);

  const handleReset = useCallback(() => {
    dispatch(setFilters(defaultFilters));
    onApplyFilters(defaultFilters);
    setLastAppliedFilters(defaultFilters);
  }, [dispatch, onApplyFilters]);

  const filterContentProps = {
    filters,
    dispatch,
    hasChanges,
    isDefaultFilters,
    onApply: handleApply,
    onReset: handleReset,
  };

  if (!isMobile) {
    return (
      <DesktopWrapper
        {...filterContentProps}
        open={desktopOpen}
        drawerWidth={drawerWidth}
        onToggle={onToggleDesktop}
      />
    );
  }

  return <MobileWrapper {...filterContentProps} />;
};
