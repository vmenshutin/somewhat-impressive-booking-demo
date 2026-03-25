import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  fetchStays,
  setFilters,
  setSortBy,
  FiltersState,
  SortOption,
} from "../../store/staysSlice";
import { AppDispatch, RootState } from "../../store/store";
import {
  StayCard,
  FilterPanel,
  StayCardSkeleton,
  EmptyState,
  StaysMap,
} from "../../components";
import { shallowCompare } from "../../utils/shallowCompare";
import styles from "./StaysListPage.module.scss";

const defaultFilters: FiltersState = {
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  location: "",
  checkIn: null,
  checkOut: null,
};

export const StaysListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, listLoading, filters, sortBy } = useSelector(
    (state: RootState) => state.stays,
  );
  const [selectedStayId, setSelectedStayId] = useState<string | undefined>();
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(true);
  const drawerWidth = 300;

  // Check if filtering by dates (both dates selected)
  const hasDateFilter = !!filters.checkIn && !!filters.checkOut;

  useEffect(() => {
    const loadStays = async () => {
      await dispatch(fetchStays());
    };
    loadStays();
  }, [dispatch]);

  const fetchStaysWithParams = useCallback(
    async ({
      filtersToApply = filters,
      sortByToApply,
    }: {
      filtersToApply?: FiltersState;
      sortByToApply?: SortOption;
    } = {}) => {
      if (sortByToApply && sortByToApply !== sortBy) {
        dispatch(setSortBy(sortByToApply));
      }

      const normalizedFilters: FiltersState = {
        ...filtersToApply,
        location: filtersToApply.location.trim(),
        checkIn:
          filtersToApply.checkIn && filtersToApply.checkOut
            ? filtersToApply.checkIn
            : null,
        checkOut:
          filtersToApply.checkIn && filtersToApply.checkOut
            ? filtersToApply.checkOut
            : null,
      };

      const hasFilters = !shallowCompare(normalizedFilters, defaultFilters);
      await dispatch(
        fetchStays({
          filters: hasFilters ? normalizedFilters : undefined,
          sortBy: sortByToApply ?? sortBy,
        }),
      );
    },
    [dispatch, filters, sortBy],
  );

  const handleApplyFilters = async (filtersToApply?: FiltersState) => {
    await fetchStaysWithParams({ filtersToApply });
  };

  const handleSortChange = async (event: SelectChangeEvent) => {
    const nextSortBy = event.target.value as SortOption;
    await fetchStaysWithParams({ sortByToApply: nextSortBy });
  };

  const handleResetFilters = async () => {
    dispatch(setFilters(defaultFilters));
    await fetchStaysWithParams({ filtersToApply: defaultFilters });
  };

  const handleMarkerClick = (stayId: string) => {
    setSelectedStayId(stayId);
    // Scroll to the selected card
    const element = document.getElementById(`stay-card-${stayId}`)
      ?.firstElementChild as HTMLElement | null;
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      element.style.boxShadow = "0 0 0 2px #1976d2";
      setTimeout(() => {
        element.style.boxShadow = "";
      }, 2000);
    }
  };

  const getStayCardWrapperClassName = useMemo(
    () => (stayId: string) =>
      !selectedStayId || selectedStayId === stayId
        ? styles.stayCardWrap
        : `${styles.stayCardWrap} ${styles.stayCardDimmed}`,
    [selectedStayId],
  );

  return (
    <>
      <Container maxWidth={false} className={styles.pageContainer}>
        <Box className={styles.pageLayout}>
          <FilterPanel
            onApplyFilters={handleApplyFilters}
            desktopOpen={desktopFiltersOpen}
            onToggleDesktop={() => setDesktopFiltersOpen((prev) => !prev)}
            drawerWidth={drawerWidth}
          />

          <Box className={styles.listingsContent}>
            <Box className={styles.cardsColumn}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box className={styles.sortBar}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        className={styles.resultsCount}
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {items.length} {items.length === 1 ? "stay" : "stays"}{" "}
                        available
                      </Typography>
                    </Box>
                    <FormControl className={styles.sortControl}>
                      <InputLabel id="sort-label">Sort by</InputLabel>
                      <Select
                        labelId="sort-label"
                        id="sort-select"
                        value={sortBy}
                        onChange={handleSortChange}
                        label="Sort by"
                        size="small"
                      >
                        <MenuItem value="name">Name (A-Z)</MenuItem>
                        <MenuItem value="price-asc">
                          Price (Low to High)
                        </MenuItem>
                        <MenuItem value="price-desc">
                          Price (High to Low)
                        </MenuItem>
                        <MenuItem value="rating-asc">
                          Rating (Low to High)
                        </MenuItem>
                        <MenuItem value="rating-desc">
                          Rating (High to Low)
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {listLoading ? (
                    <Grid container spacing={3}>
                      {[1, 2, 3, 4, 5, 6].map((skeleton) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={4}
                          key={`skeleton-${skeleton}`}
                        >
                          <StayCardSkeleton />
                        </Grid>
                      ))}
                    </Grid>
                  ) : items.length > 0 ? (
                    <Grid container spacing={3}>
                      {items.map((stay) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={4}
                          key={stay.id}
                          id={`stay-card-${stay.id}`}
                        >
                          <Box
                            onMouseEnter={() => setSelectedStayId(stay.id)}
                            onMouseLeave={() => setSelectedStayId(undefined)}
                            className={getStayCardWrapperClassName(stay.id)}
                          >
                            <StayCard stay={stay} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <EmptyState
                      onReset={handleResetFilters}
                      hasDateFilter={hasDateFilter}
                    />
                  )}
                </Grid>
              </Grid>
            </Box>

            <Box className={styles.mapColumn}>
              <Paper className={styles.mapPaper}>
                {!listLoading && items.length > 0 ? (
                  <StaysMap
                    stays={items}
                    selectedStayId={selectedStayId}
                    onMarkerClick={handleMarkerClick}
                  />
                ) : (
                  <Box className={styles.mapFallback}>
                    <Typography color="text.secondary">
                      {listLoading ? "Loading map..." : "No stays to display"}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};
