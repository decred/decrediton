import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import SignMessage from "./SignMessage";
import ValidateAddressTab from "./ValidateAddress";
import VerifyMessageTab from "./VerifyMessage";
import { classNames } from "pi-ui";
import styles from "./SecurityTab.module.css";

export default () => {
  const [sideActive, setSideActive] = useState(true);
  return (
    <>
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
    </>
  );
};
