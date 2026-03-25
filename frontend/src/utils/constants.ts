export const DATE_PICKER_SLOT_PROPS = {
  fullWidth: true,
  size: "small" as const,
  variant: "outlined" as const,
  required: true,
  helperText: "Select a valid date",
  margin: "normal" as const,
  inputProps: { readOnly: true },
};
