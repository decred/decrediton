import { FormattedMessage as T } from "react-intl";
import { Link } from "react-router-dom";

const ErrorScreen = () => (
  <>
    <p><T id="errors.general" m="Something went wrong, please go back " /></p>
    <Link to='/'><T id="errors.goHome" m="Back to Home" /></Link>
  </>
);

export default ErrorScreen;
