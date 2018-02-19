import { LinksTab, LinksTabHeader } from "./LinksTab";
import { LogsTab, LogsTabHeader } from "./LogsTab";
import { TabbedPage, TabbedPageTab as Tab, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";

const HelpPageHeader = () =>
  <TitleHeader
    iconClassName="help"
    title={<T id="help.title" m="Help" />}
  />;

export default () => (
  <TabbedPage header={<HelpPageHeader />}>
    <Tab path="/help/links" component={LinksTab} header={LinksTabHeader} link={<T id="help.tab.links" m="Links"/>}/>
    <Tab path="/help/logs" component={LogsTab} header={LogsTabHeader} link={<T id="help.tab.logs" m="Logs"/>}/>
  </TabbedPage>
);
