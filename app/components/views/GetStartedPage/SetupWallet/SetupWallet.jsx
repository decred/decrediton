import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { useEffect } from "react";
import { useWalletSetup } from "./hooks";

const SetupWallet = ({ settingUpWalletRef }) => {
  const { getStateComponent, StateComponent } = useWalletSetup(
    settingUpWalletRef
  );

  useEffect(() => {
    getStateComponent();
  }, [getStateComponent]);

  return (
    <div>
      {StateComponent &&
        (React.isValidElement(StateComponent) ? (
          StateComponent
        ) : (
          <StateComponent />
        ))}
    </div>
  );
};

export default injectIntl(withRouter(SetupWallet));
