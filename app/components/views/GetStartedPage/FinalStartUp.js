import Header from "Header";
import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

const FinalStartUpHeader = () => (
  <Header
    getStarted
    headerTitleOverview={<T id="getStarted.header.title" m="Setting up Decrediton" />}
    headerMetaOverview={<T id="getStarted.header.finalizingSetup.meta" m="Finalizing setup" />} />
);

const FinalStartUpBody = () => (
  null
);

export { FinalStartUpHeader, FinalStartUpBody };
