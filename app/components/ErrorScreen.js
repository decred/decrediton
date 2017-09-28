import React from "react";
import { Link } from "react-router";
import { FormattedMessage } from "react-intl";

const ErrorScreen = () => (
  <div>
    <p>
      <FormattedMessage id="errors.general" defaultMessage="Something went wrong, please go back " />
    </p>
    <Link to='/'><FormattedMessage id="errors.goHome" defaultMessage="Back to Home" /></Link>
  </div>
);

export default ErrorScreen;
