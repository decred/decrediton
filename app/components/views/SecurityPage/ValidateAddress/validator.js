import { FormattedMessage as T } from "react-intl";

export const validate = values => {
  const errors = {};
  if (!values.address) {
    errors.global = <T id="securitycenter.form.error.mandatory.all" m="* Address is required" />;
  }

  return errors;
};
