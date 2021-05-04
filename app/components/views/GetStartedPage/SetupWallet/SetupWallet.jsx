import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { useEffect } from "react";
import { useWalletSetup } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import { AnimatedLinearProgressFull } from "indicators";
import { Header } from "../helpers";
import styles from "./SetupWallet.module.css";

const SetupWallet = ({
  settingUpWalletRef,
  appVersion,
  onShowTutorial,
  onShowReleaseNotes
}) => {
  const { getStateComponent, StateComponent } = useWalletSetup(
    settingUpWalletRef
  );

  useEffect(() => {
    getStateComponent();
  }, [getStateComponent]);

  return (
    <div>
      {StateComponent && React.isValidElement(StateComponent) ? (
        StateComponent
      ) : (
        <>
          <Header {...{ onShowTutorial, onShowReleaseNotes, appVersion }} />
          <div className={styles.loaderBar}>
            <AnimatedLinearProgressFull
              {...{
                text: <T id="setupwallet.progressLabel" m="Setup Wallet" />,
                animationType: styles.setupWallet,
                hideTextBlock: true
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default injectIntl(withRouter(SetupWallet));
