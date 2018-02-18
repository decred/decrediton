import Header from "Header";
import { FormattedMessage as T } from "react-intl";

export default ({...props}) =>
  <Header
    getStarted
    headerTitleOverview={<T id="getStarted.header.title" m="Setting up Hxify" />}
    {...props} />;
