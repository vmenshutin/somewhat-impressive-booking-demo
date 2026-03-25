import { useCallback, useMemo, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import styles from "./ContactSection.module.scss";

export interface ContactValues {
  firstName: string;
  lastName: string;
  email: string;
}

interface ContactSectionProps {
  onValidChange: (values: ContactValues, isValid: boolean) => void;
  onContinue: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const computeValid = (v: ContactValues) =>
  v.firstName.trim().length > 0 &&
  v.lastName.trim().length > 0 &&
  EMAIL_REGEX.test(v.email.trim());

export const ContactSection = ({
  onValidChange,
  onContinue,
}: ContactSectionProps) => {
  const [values, setValues] = useState<ContactValues>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
  });

  const errors = {
    firstName: touched.firstName && values.firstName.trim().length === 0,
    lastName: touched.lastName && values.lastName.trim().length === 0,
    email: touched.email && !EMAIL_REGEX.test(values.email.trim()),
  };

  const isValid = useMemo(() => computeValid(values), [values]);

  const handleChange = useCallback(
    (field: keyof ContactValues, value: string) => {
      const next = { ...values, [field]: value };
      setValues(next);
      onValidChange(next, computeValid(next));
    },
    [values, onValidChange],
  );

  const handleBlur = useCallback(
    (field: keyof ContactValues) =>
      setTouched((prev) => ({ ...prev, [field]: true })),
    [],
  );

  return (
    <Box className={styles.sectionContent}>
      <TextField
        label="First Name"
        value={values.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
        onBlur={() => handleBlur("firstName")}
        error={errors.firstName}
        helperText={errors.firstName ? "First name is required" : ""}
        fullWidth
        size="small"
      />
      <TextField
        label="Last Name"
        value={values.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
        onBlur={() => handleBlur("lastName")}
        error={errors.lastName}
        helperText={errors.lastName ? "Last name is required" : ""}
        fullWidth
        size="small"
      />
      <TextField
        label="Email"
        value={values.email}
        onChange={(e) => handleChange("email", e.target.value)}
        onBlur={() => handleBlur("email")}
        error={errors.email}
        helperText={errors.email ? "Enter a valid email address" : ""}
        fullWidth
        size="small"
      />
      <Box className={styles.sectionActions}>
        <Button variant="contained" onClick={onContinue} disabled={!isValid}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};
