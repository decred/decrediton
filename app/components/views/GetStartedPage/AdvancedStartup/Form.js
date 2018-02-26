import { KeyBlueButton } from "buttons";
import RemoteDaemonForm from "./RemoteDaemonForm";
import AppDataForm from "./AppDataForm";
import { FormattedMessage as T, injectIntl } from "react-intl";
import "style/LoginForm.less";

const AdvancedBodyBase = ({
  onShowRemote,
  onShowAppData,
  sideActive,
  onSubmitAppDataForm,
  onSubmitRemoteForm,
  setRpcUser,
  setRpcPass,
  setRpcCert,
  setRpcHost,
  setRpcPort,
  setAppData,
  skipAdvancedDaemon,
  rpcuser,
  rpcpass,
  rpccert,
  rpchost,
  rpcport,
  appData,
  intl,
  ...props,
}) => {
  return (
    <Aux>
      <div className="advanced-page-toggle">
        <div className="text-toggle">
          <div className={"text-toggle-button-left " + (!sideActive && "text-toggle-button-active")} onClick={sideActive ? onShowRemote : null}>
            <T id="advancedDaemon.toggle.remote" m="Remote Daemon" />
          </div>
          <div className={"text-toggle-button-right " + (sideActive && "text-toggle-button-active")} onClick={!sideActive ? onShowAppData : null}>
            <T id="advancedDaemon.toggle.appdata" m="Different Local Daemon Location" />
          </div>
        </div>
      </div>
      <div className="advanced-page-form">
        {sideActive ?
          <RemoteDaemonForm {...{
            ...props,
            onSubmitRemoteForm,
            setRpcUser,
            setRpcPass,
            setRpcCert,
            setRpcHost,
            setRpcPort,
            rpcuser,
            rpcpass,
            rpccert,
            rpchost,
            rpcport,
            intl
          }}
          /> :
          <AppDataForm {...{
            ...props,
            onSubmitAppDataForm,
            setAppData,
            appData,
            intl
          }} />
        }
      </div>
      <KeyBlueButton onClick={skipAdvancedDaemon}>
        <T id="advancedStartup.skip" m="Skip Advanced Daemon Connection"/>
      </KeyBlueButton>
    </Aux>
  );
};

export const AdvancedBody = injectIntl(AdvancedBodyBase);
