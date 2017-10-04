import React from "react";
import { Link } from "react-router";
import { FormattedMessage as T } from "react-intl";

const ErrorScreen = () => (
  <div>
    <p>
      <T id="errors.general" m="Something went wrong, please go back " />
    </p>
    <Link to='/'><T id="errors.goHome" m="Back to Home" /></Link>
  </div>
);

export default ErrorScreen;
