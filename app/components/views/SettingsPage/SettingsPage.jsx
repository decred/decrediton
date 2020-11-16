import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import { TabbedPage, TabbedPageTab as Tab, TitleHeader } from "layout";
import { LinksTab, LinksTabHeader } from "./LinksTab";
import { LogsTab, LogsTabHeader } from "./LogsTab/LogsTab";
import { TutorialsTab, TutorialsTabHeader } from "./TutorialsTab/TutorialsTab";
import { SettingsTab/*, SettingsTabHeader*/ } from "./SettingsTab/SettingsTab";

const SettingsPageHeader = () => (
  <TitleHeader
    iconClassName="settings"
    title={<T id="settings.title" m="Settings" />}
  />
);

const SettingsPage = () => (
  <TabbedPage header={<SettingsPageHeader />}>
    <Switch>
      <Redirect from="/settings" exact to="/settings/settings" />
    </Switch>
    <Tab
      path="/settings/settings"
      component={SettingsTab}
      header={SettingsPageHeader}
      link={<T id="settings.tab.settings" m="Settings" />}
    />
    <Tab
      path="/settings/links"
      component={LinksTab}
      header={LinksTabHeader}
      link={<T id="settings.tab.sources" m="Sources" />}
    />
    <Tab
      path="/settings/tutorials"
      component={TutorialsTab}
      header={TutorialsTabHeader}
      link={<T id="settings.tab.tutorials" m="Tutorials" />}
    />
    <Tab
      path="/settings/logs"
      component={LogsTab}
      header={LogsTabHeader}
      link={<T id="settings.tab.logs" m="Logs" />}
    />
  </TabbedPage>
);

export default SettingsPage;
