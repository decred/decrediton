import Header from "./DefaultHeader";
import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

const FinalStartUpHeader = () => (
  <Header
    headerMetaOverview={<T id="getStarted.header.finalizingSetup.meta" m="Finalizing setup" />} />
);

const FinalStartUpBody = () => (
  null
);

export { FinalStartUpHeader, FinalStartUpBody };
