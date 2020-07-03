import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import { StandalonePage, StandaloneHeader } from "layout";
import SignMessage from "./SignMessage/SignMessage";
import { default as ValidateAddressTab } from "./ValidateAddress/ValidateAddress";
import { default as VerifyMessageTab } from "./VerifyMessage/VerifyMessage";
import { classNames } from "pi-ui";
import styles from "./SecurityPage.module.css";

const SecurityHeader = () => (
  <StandaloneHeader
    iconClassName="security"
    title={<T id="security.title" m="Security Center" />}
    description={
      <T
        id="security.description"
        m="Various tools that help in different aspects of crypto currency security will be located here."
      />
    }
  />
);

export default () => {
  const [sideActive, setSideActive] = useState(true);
  return (
    <StandalonePage header={<SecurityHeader />}>
      <>
        <div className={styles.securityPage}>
          <div className={styles.textToggle}>
            <div
              className={classNames(
                styles.textToggleButtonLeft,
                sideActive && styles.textToggleButtonActive
              )}
              onClick={!sideActive ? () => setSideActive(true) : null}>
              <T id="security.signTitle" m="Sign Message" />
            </div>
            <div
              className={classNames(
                styles.textToggleButtonRight,
                !sideActive && styles.textToggleButtonActive
              )}
              onClick={sideActive ? () => setSideActive(false) : null}>
              <T id="security.verifyTitle" m="Verify Message" />
            </div>
          </div>
        </div>
        <div className={styles.securityPageTab}>
          {sideActive ? <SignMessage /> : <VerifyMessageTab />}
        </div>
      </>
      <ValidateAddressTab />
    </StandalonePage>
  );
}