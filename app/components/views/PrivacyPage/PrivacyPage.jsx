import { TabbedPage, TabbedPageTab as Tab, StandaloneHeader } from "layout";
import { Switch, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import SecurityTab from "./SecurityPage/SecurityPage";
import PrivacyTab from "./Privacy/Privacy";
import { usePrivacyPage } from "./hooks";
import style from "./Privacy/Privacy.module.css";

const PrivacyPageHeader = React.memo(
  () => (
    <StandaloneHeader
    iconClassName="security"
    title={<T id="privacypage.title" m="Privacy and Security" />}
    description={
      <T
        id="privacy.description"
        m={"Create anonymity to your $DCR by using the mixing service.\nFunds in {unmixedAccount} are automatically sent to {mixedAccount} once mixed."}
        values={{
          unmixedAccount: (
            <span className={style.highlighted}>Unmixed Account</span>
          ),
          mixedAccount: (
            <span className={style.highlighted}>Mixed Account</span>
          )
        }}
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
        link={<T id="privacy.tab.privacy" m="Privacy" />}
        disabled={!privacyEnabled}
      />
      <Tab
        path="/privacy/security"
        component={SecurityTab}
        link={<T id="privacy.tab.security.center" m="Security Center" />}
      />
    </TabbedPage>
  );
};
export default PrivacyPage;
