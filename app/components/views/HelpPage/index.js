import { LinksTab, LinksTabHeader } from "./LinksTab";
import { LogsTab, LogsTabHeader } from "./LogsTab";
import { TutorialsTab, TutorialsTabHeader } from "./TutorialsTab";
import { TabbedPage, TabbedPageTab as Tab, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import { helpPage } from "connectors";

const HelpPageHeader = () =>
  <TitleHeader
    iconClassName="help"
    title={<T id="help.title" m="Help" />}
  />;

const HelpPage = () =>
  <TabbedPage header={<HelpPageHeader />}>
    <Switch><Redirect from="/help" exact to="/help/links" /></Switch>
    <Tab path="/help/links" component={LinksTab} header={LinksTabHeader} link={<T id="help.tab.sources" m="Sources"/>}/>
    <Tab path="/help/tutorials" component={TutorialsTab} header={TutorialsTabHeader} link={<T id="help.tab.tutorials" m="Tutorials"/>}/>
    <Tab path="/help/logs" component={LogsTab} header={LogsTabHeader} link={<T id="help.tab.logs" m="Logs"/>}/>
  </TabbedPage>;

export default helpPage(HelpPage);
