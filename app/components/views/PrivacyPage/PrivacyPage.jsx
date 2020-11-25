import { TabbedPage, TabbedPageTab as Tab, StandaloneHeader } from "layout";
import { Switch, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import SecurityTab from "./SecurityPage/SecurityPage";
import PrivacyTab from "./Privacy/Privacy";
import { usePrivacyPage } from "./hooks";
import style from "./Privacy/Privacy.module.css";

const PrivacyPageHeader = React.memo(
  ({ mixedAccountName, changeAccountName }) => (
    <StandaloneHeader
      iconClassName="security"
      title={<T id="privacypage.title" m="Privacy and Security" />}
      description={
        <T
          id="privacy.description"
          m={
            "Improve the anonymity of your $DCR.\nFunds in {unmixedAccount} account are automatically sent to {mixedAccount} account once mixed."
          }
          values={{
            unmixedAccount: changeAccountName ? (
              <span className={style.highlighted}>{changeAccountName}</span>
            ) : (
              <T id="privacy.tab.unmixed" m="unmixed" />
            ),
            mixedAccount: mixedAccountName ? (
              <span className={style.highlighted}>{mixedAccountName}</span>
            ) : (
              <T id="privacy.tab.mixed" m="mixed" />
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
    isCreateAccountDisabled,
    mixedAccountName,
    changeAccountName
  } = usePrivacyPage();
  return (
    <TabbedPage
      header={
        <PrivacyPageHeader {...{ mixedAccountName, changeAccountName }} />
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
