import { TabbedPage, TabbedPageTab as Tab, StandaloneHeader } from "layout";
import { Switch, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import SecurityTab from "./SecurityPage/SecurityPage";
import PrivacyTab from "./Privacy/Privacy";
import { usePrivacyPage } from "./hooks";

const PrivacyPageHeader = React.memo(
  () => (
    <StandaloneHeader
    iconClassName="security"
    title={<T id="privacy.title" m="Privacy and Security Center" />}
    description={
      <T
        id="privacy.description"
        m="Various tools that help in different aspects of crypto currency privacy and security will be located here."
      />
    }
  />
  )
);

const PrivacyPage = () => {
  const {
    privacyEnabled,
    isCreateAccountDisabled
  } = usePrivacyPage();
  return (
    <TabbedPage
      header={
        <PrivacyPageHeader/>
      }>
      <Switch>
        <Redirect from="/privacy" exact to="/privacy/mixing" />
      </Switch>
      <Tab
        path="/privacy/mixing"
        component={<PrivacyTab {...{ isCreateAccountDisabled }} />}
        link={<T id="privacy.tab.mixing" m="Mixing" />}
        disabled={!privacyEnabled}
      />
      <Tab
        path="/privacy/security"
        component={SecurityTab}
        link={<T id="privacy.tab.security" m="Security" />}
      />
    </TabbedPage>
  );
};
export default PrivacyPage;
