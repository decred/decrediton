import { Link } from "react-router";
import { FormattedMessage as T } from "react-intl";

const ErrorScreen = ({ routes }) => (
  <Aux>
    <TabbedHeader {...{ routes }}/>
    <p><T id="errors.general" m="Something went wrong, please go back " /></p>
    <Link to='/'><T id="errors.goHome" m="Back to Home" /></Link>
  </Aux>
);

export default ErrorScreen;
