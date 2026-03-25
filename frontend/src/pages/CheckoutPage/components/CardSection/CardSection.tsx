import { useCallback, useState } from "react";
import { Box, TextField } from "@mui/material";
import styles from "./CardSection.module.scss";

export interface CardValues {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface CardSectionProps {
  onValidChange: (
    values: CardValues,
    normalizedNumber: string,
    isValid: boolean,
  ) => void;
}

const EXPIRY_REGEX = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;

const computeValid = (normalized: string, expiry: string, cvv: string) =>
  /^\d{16}$/.test(normalized) &&
  EXPIRY_REGEX.test(expiry) &&
  /^\d{3,4}$/.test(cvv);

export const CardSection = ({ onValidChange }: CardSectionProps) => {
  const [values, setValues] = useState<CardValues>({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [touched, setTouched] = useState({
    cardNumber: false,
    expiry: false,
    cvv: false,
  });

  const normalized = values.cardNumber.replace(/\s/g, "");
  const detectedCardType = normalized.startsWith("4")
    ? "visa"
    : /^5[1-5]/.test(normalized)
      ? "mastercard"
      : "";

  const errors = {
    cardNumber: touched.cardNumber && !/^\d{16}$/.test(normalized),
    expiry: touched.expiry && !EXPIRY_REGEX.test(values.expiry),
    cvv: touched.cvv && !/^\d{3,4}$/.test(values.cvv),
  };

  const handleChange = useCallback(
    (field: keyof CardValues, value: string) => {
      const next = { ...values, [field]: value };
      setValues(next);
      const norm = next.cardNumber.replace(/\s/g, "");
      onValidChange(next, norm, computeValid(norm, next.expiry, next.cvv));
    },
    [values, onValidChange],
  );

  const handleBlur = useCallback(
    (field: keyof CardValues) =>
      setTouched((prev) => ({ ...prev, [field]: true })),
    [],
  );

  return (
    <Box className={styles.sectionContent}>
      <Box className={styles.cardBadges}>
        <Box
          className={`${styles.cardBadge} ${detectedCardType === "visa" ? styles.cardBadgeActive : ""}`}
        >
          VISA
        </Box>
        <Box
          className={`${styles.cardBadge} ${detectedCardType === "mastercard" ? styles.cardBadgeActive : ""}`}
        >
          Mastercard
        </Box>
      </Box>

      <TextField
        label="Card Number"
        value={values.cardNumber}
        onChange={(e) =>
          handleChange("cardNumber", e.target.value.replace(/[^\d\s]/g, ""))
        }
        onBlur={() => handleBlur("cardNumber")}
        error={errors.cardNumber}
        helperText={errors.cardNumber ? "Enter a 16-digit card number" : ""}
        fullWidth
        size="small"
      />
      <Box className={styles.inlineFields}>
        <TextField
          label="Expiry (MM/YY)"
          value={values.expiry}
          onChange={(e) => handleChange("expiry", e.target.value)}
          onBlur={() => handleBlur("expiry")}
          error={errors.expiry}
          helperText={errors.expiry ? "Use MM/YY format" : ""}
          fullWidth
          size="small"
        />
        <TextField
          label="CVV"
          value={values.cvv}
          onChange={(e) =>
            handleChange("cvv", e.target.value.replace(/\D/g, ""))
          }
          onBlur={() => handleBlur("cvv")}
          error={errors.cvv}
          helperText={errors.cvv ? "3 or 4 digits" : ""}
          fullWidth
          size="small"
        />
      </Box>
    </Box>
  );
};
