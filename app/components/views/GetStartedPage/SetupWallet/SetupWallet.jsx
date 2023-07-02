import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { useEffect } from "react";
import { useWalletSetup } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import { AnimatedLinearProgressFull } from "indicators";
import styles from "./SetupWallet.module.css";
import { LoaderBarContainer } from "../helpers";

const SetupWallet = ({
  NavlinkComponent,
  LoadingPageComponent,
  settingUpWalletRef
}) => {
  const { getStateComponent, StateComponent } =
    useWalletSetup(settingUpWalletRef);

  useEffect(() => {
    getStateComponent();
  }, [getStateComponent]);

  return (
    <div>
      {NavlinkComponent && React.isValidElement(NavlinkComponent)
        ? NavlinkComponent
        : StateComponent && React.isValidElement(StateComponent)
        ? StateComponent
        : LoadingPageComponent &&
          React.isValidElement(LoadingPageComponent) &&
          LoadingPageComponent}
      <LoaderBarContainer
        className={styles.loaderBar}
        loaderBar={
          <AnimatedLinearProgressFull
            {...{
              text: <T id="setupwallet.progressLabel" m="Setup Wallet" />,
              animationType: styles.setupWallet,
              hideTextBlock: true,
              hideOpenWalletButton: true
            }}
          />
        }
      />
    </div>
  );
};

export default injectIntl(withRouter(SetupWallet));
