export const validate = values => {
  const errors = {};
  if (!values.address || !values.message || !values.signature) {
    errors.global = "All fields are mandatory";
  }

  return errors;
};
