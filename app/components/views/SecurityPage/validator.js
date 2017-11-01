import React from "react";
import { FormattedMessage as T } from "react-intl";

export const signMessageValidator = values => {
  const errors = {};
console.log(values)
  if (!values.address || !values.message || !values.passphrase) {
    errors.global = <T id="securitycenter.form.error.mandatory.all" m="* All fields are mandatory" />;
  }

  return errors;
};
