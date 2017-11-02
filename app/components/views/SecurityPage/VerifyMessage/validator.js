import { FormattedMessage as T } from "react-intl";

export const validate = values => {
  const errors = {};
  if (!values.address || !values.message || !values.signature) {
    errors.global = <T id="securitycenter.form.error.mandatory.all" m="All fields are mandatory" />;
  }

  return errors;
};
