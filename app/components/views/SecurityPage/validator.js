import React from "react";
import { FormattedMessage as T } from "react-intl";

export const signMessageValidator = values => {
  const errors = {};
  
  errors.address = !values.address ? <T id="securitycenter.form.error.mandatory.all" m="Required Field" /> : null;
  errors.message = !values.message ? <T id="securitycenter.form.error.mandatory.all" m="Required Field" /> : null;
  errors.passphrase = !values.passphrase ? <T id="securitycenter.form.error.mandatory.all" m="Required Field" /> : null;

  return errors;
};
