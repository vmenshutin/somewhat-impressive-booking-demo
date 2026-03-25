import { useCallback, useMemo, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import styles from "./AddressSection.module.scss";

export interface AddressValues {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressSectionProps {
  onValidChange: (values: AddressValues, isValid: boolean) => void;
  onContinue: () => void;
}

const ZIP_REGEX = /^[A-Za-z0-9][A-Za-z0-9\s-]{1,9}$/;

const computeValid = (v: AddressValues) =>
  v.street.trim().length > 0 &&
  v.city.trim().length > 0 &&
  v.state.trim().length > 0 &&
  ZIP_REGEX.test(v.zipCode.trim()) &&
  v.country.trim().length > 0;

export const AddressSection = ({
  onValidChange,
  onContinue,
}: AddressSectionProps) => {
  const [values, setValues] = useState<AddressValues>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [touched, setTouched] = useState({
    street: false,
    city: false,
    state: false,
    zipCode: false,
    country: false,
  });

  const errors = {
    street: touched.street && values.street.trim().length === 0,
    city: touched.city && values.city.trim().length === 0,
    state: touched.state && values.state.trim().length === 0,
    zipCode: touched.zipCode && !ZIP_REGEX.test(values.zipCode.trim()),
    country: touched.country && values.country.trim().length === 0,
  };

  const isValid = useMemo(() => computeValid(values), [values]);

  const handleChange = useCallback(
    (field: keyof AddressValues, value: string) => {
      const next = { ...values, [field]: value };
      setValues(next);
      onValidChange(next, computeValid(next));
    },
    [values, onValidChange],
  );

  const handleBlur = useCallback(
    (field: keyof AddressValues) =>
      setTouched((prev) => ({ ...prev, [field]: true })),
    [],
  );

  return (
    <Box className={styles.sectionContent}>
      <TextField
        label="Street Address"
        value={values.street}
        onChange={(e) => handleChange("street", e.target.value)}
        onBlur={() => handleBlur("street")}
        error={errors.street}
        helperText={errors.street ? "Street address is required" : ""}
        fullWidth
        size="small"
      />
      <Box className={styles.inlineFields}>
        <TextField
          label="City"
          value={values.city}
          onChange={(e) => handleChange("city", e.target.value)}
          onBlur={() => handleBlur("city")}
          error={errors.city}
          helperText={errors.city ? "City is required" : ""}
          fullWidth
          size="small"
        />
        <TextField
          label="State / Province"
          value={values.state}
          onChange={(e) => handleChange("state", e.target.value)}
          onBlur={() => handleBlur("state")}
          error={errors.state}
          helperText={errors.state ? "State is required" : ""}
          fullWidth
          size="small"
        />
      </Box>
      <Box className={styles.inlineFields}>
        <TextField
          label="ZIP / Postal Code"
          value={values.zipCode}
          onChange={(e) => handleChange("zipCode", e.target.value)}
          onBlur={() => handleBlur("zipCode")}
          error={errors.zipCode}
          helperText={errors.zipCode ? "Enter a valid postal code" : ""}
          fullWidth
          size="small"
        />
        <TextField
          label="Country"
          value={values.country}
          onChange={(e) => handleChange("country", e.target.value)}
          onBlur={() => handleBlur("country")}
          error={errors.country}
          helperText={errors.country ? "Country is required" : ""}
          fullWidth
          size="small"
        />
      </Box>
      <Box className={styles.sectionActions}>
        <Button variant="contained" onClick={onContinue} disabled={!isValid}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};
