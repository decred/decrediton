import { TabbedPage, TitleHeader, DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import SecurityTab from "./SecurityTab";
import PrivacyTab from "./PrivacyTab";
import { usePrivacyPage } from "./hooks";
import styles from "./PrivacyPage.module.css";
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
            <span className={styles.highlighted}>{changeAccountName}</span>
          ),
          mixedAccount: (
            <span className={styles.highlighted}>{mixedAccountName}</span>
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

const PrivacyPageHeader = () => (
  <TitleHeader
    iconType={SECURITY_ICON}
    title={<T id="privacypage.title" m="Privacy and Security" />}
    docUrl="https://docs.decred.org/wallets/decrediton/using-decrediton/#privacy-and-security"
  />
);

const PrivacyPage = () => {
  const { privacyEnabled } = usePrivacyPage();
  const tabs = [
    {
      path: "/privacy/mixing",
      content: PrivacyTab,
      header: PrivacyTabHeader,
      label: <T id="privacy.tab.privacy" m="Privacy" />,
      disabled: !privacyEnabled
    },
    {
      path: "/privacy/security",
      content: SecurityTab,
      header: PrivacyTabHeader,
      label: <T id="privacy.tab.security.center" m="Security Center" />
    }
  ];
  return <TabbedPage header={<PrivacyPageHeader />} tabs={tabs} />;
};

export default PrivacyPage;
