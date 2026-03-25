import {
  TextField,
  Slider,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import type { KeyboardEvent } from "react";
import { AppDispatch } from "../../../../store/store";
import { FiltersState, setFilters } from "../../../../store/staysSlice";
import styles from "./FilterContent.module.scss";
import { DATE_PICKER_SLOT_PROPS } from "../../../../utils/constants";

const slotProps = {
  ...DATE_PICKER_SLOT_PROPS,
  className: styles.datePickerField,
};

const MIN_RATING_OPTIONS = [
  { value: 0, label: "Any rating" },
  { value: 2, label: "2.0+" },
  { value: 3, label: "3.0+" },
  { value: 4, label: "4.0+" },
  { value: 4.5, label: "4.5+" },
] as const;

export interface FilterContentProps {
  filters: FiltersState;
  dispatch: AppDispatch;
  hasChanges: boolean;
  isDefaultFilters: boolean;
  onApply: () => void;
  onReset: () => void;
}

export const FilterContent = ({
  filters,
  dispatch,
  hasChanges,
  isDefaultFilters,
  onApply,
  onReset,
}: FilterContentProps) => {
  const { checkIn, checkOut } = filters;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onApply();
    }
  };

  return (
    <Stack
      component="form"
      role="search"
      aria-label="Filter stays"
      spacing={2}
      className={styles.filterContent}
      onKeyDown={handleKeyDown}
      onSubmit={(e) => {
        e.preventDefault();
        onApply();
      }}
    >
      {/* Dates */}
      <Stack
        spacing={1.5}
        className={styles.filterSection}
        role="group"
        aria-label="Dates"
      >
        <DatePicker
          label="Check-in"
          value={checkIn}
          onChange={(date: Dayjs | null) => {
            dispatch(
              setFilters({
                ...filters,
                checkIn: date,
                checkOut: date ? date.add(1, "day") : null,
              }),
            );
          }}
          shouldDisableDate={(date) => {
            const today = dayjs().startOf("day");
            if (date.isBefore(today)) {
              return true;
            }
            return false;
          }}
          slotProps={{
            textField: slotProps,
          }}
        />
        <DatePicker
          label="Check-out"
          value={checkOut}
          onChange={(date: Dayjs | null) => {
            dispatch(setFilters({ ...filters, checkOut: date }));
          }}
          disabled={!checkIn}
          referenceDate={checkOut || undefined}
          shouldDisableDate={(date) => {
            if (checkIn && !date.isAfter(checkIn)) {
              return true;
            }
            return false;
          }}
          slotProps={{
            textField: slotProps,
          }}
        />
      </Stack>

      <Divider aria-hidden="true" />

      {/* Location */}
      <Stack spacing={1} className={styles.filterSection}>
        <TextField
          fullWidth
          label="Location"
          value={filters.location}
          onChange={(e) =>
            dispatch(setFilters({ ...filters, location: e.target.value }))
          }
          placeholder="e.g., Bali, Paris, Tokyo"
          InputProps={{
            startAdornment: (
              <SearchIcon className={styles.searchIcon} aria-hidden="true" />
            ),
          }}
          size="small"
        />
      </Stack>

      <Divider aria-hidden="true" />

      {/* Price */}
      <Stack
        className={styles.filterSection}
        role="group"
        aria-label="Price range"
      >
        <Typography
          variant="subtitle2"
          className={styles.sectionTitle}
          aria-hidden="true"
        >
          Price
        </Typography>
        <Typography variant="body2" color="text.secondary" aria-live="polite">
          ${filters.minPrice} – ${filters.maxPrice}
        </Typography>
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          onChange={(_, v) =>
            dispatch(
              setFilters({
                ...filters,
                minPrice: (v as number[])[0],
                maxPrice: (v as number[])[1],
              }),
            )
          }
          min={0}
          max={1000}
          step={10}
          valueLabelDisplay="auto"
          className={styles.priceSlider}
          getAriaLabel={(index) =>
            index === 0 ? "Minimum price" : "Maximum price"
          }
          getAriaValueText={(v) => `$${v}`}
        />
      </Stack>

      <Divider aria-hidden="true" />

      {/* Rating */}
      <Stack spacing={1} className={styles.filterSection}>
        <FormControl fullWidth size="small">
          <InputLabel id="rating-filter-label">Minimum Rating</InputLabel>
          <Select
            labelId="rating-filter-label"
            value={filters.minRating}
            label="Minimum Rating"
            onChange={(e) =>
              dispatch(
                setFilters({ ...filters, minRating: Number(e.target.value) }),
              )
            }
          >
            {MIN_RATING_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Divider aria-hidden="true" />

      <Stack direction="row" spacing={1.5} className={styles.actionRow}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onReset}
          disabled={isDefaultFilters}
          aria-label="Reset filters to defaults"
        >
          Reset
        </Button>
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={!hasChanges}
          aria-label={
            hasChanges ? "Apply filters" : "No filter changes to apply"
          }
        >
          Apply
        </Button>
      </Stack>
    </Stack>
  );
};
