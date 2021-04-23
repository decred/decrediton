import {
  TabbedPage,
  TabbedPageTab as Tab,
  TitleHeader,
  DescriptionHeader
} from "layout";
import { Switch, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import SecurityTab from "./SecurityPage/SecurityPage";
import PrivacyTab from "./Privacy/Privacy";
import { usePrivacyPage } from "./hooks";
import style from "./Privacy/Privacy.module.css";
import { SECURITY_ICON } from "constants";

export const PrivacyTabHeader = () => {
  const { mixedAccountName, changeAccountName } = usePrivacyPage();

  const description =
    changeAccountName && mixedAccountName ? (
      <T
        id="privacy.description"
        m={
          "Improve the anonymity of your Decred.\nFunds in {unmixedAccount} are sent to {mixedAccount} once mixed."
        }
        values={{
          unmixedAccount: (
            <span className={style.highlighted}>{changeAccountName}</span>
          ),
          mixedAccount: (
            <span className={style.highlighted}>{mixedAccountName}</span>
          )
        }}
      />
    ) : (
      <T
        id="privacy.description.brandnew.wallet"
        m={
          "Improve the anonymity of your Decred.\nFunds in the unmixed account are sent to the mixed account once mixed."
        }
      />
    );
  return <DescriptionHeader description={description} />;
};

const PrivacyPageHeader = () => {
  return (
    <TitleHeader
      iconType={SECURITY_ICON}
      title={<T id="privacypage.title" m="Privacy and Security" />}
    />
  );
};

const PrivacyPage = () => {
  const { privacyEnabled, isCreateAccountDisabled } = usePrivacyPage();

  return (
    <TabbedPage header={<PrivacyPageHeader />}>
      <Switch>
        <Redirect from="/privacy" exact to="/privacy/mixing" />
      </Switch>
      <Tab
        path="/privacy/mixing"
        component={<PrivacyTab {...{ isCreateAccountDisabled }} />}
        link={<T id="privacy.tab.privacy" m="Privacy" />}
        header={PrivacyTabHeader}
        disabled={!privacyEnabled}
      />
      <Tab
        path="/privacy/security"
        component={SecurityTab}
        header={PrivacyTabHeader}
        link={<T id="privacy.tab.security.center" m="Security Center" />}
      />
    </TabbedPage>
  );
};
export default PrivacyPage;
