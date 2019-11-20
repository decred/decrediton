import { KeyBlueButton, InvisibleButton } from "buttons";
import RemoteDaemonForm from "./RemoteDaemonForm";
import AppDataForm from "./AppDataForm";
import { FormattedMessage as T, injectIntl } from "react-intl";

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
  rpcUserHasFailedAttempt,
  rpcPasswordHasFailedAttempt,
  rpcHostHasFailedAttempt,
  rpcPortHasFailedAttempt,
  rpcCertHasFailedAttempt,
  appDataHasFailedAttempt,
  appdata,
  intl,
  remoteValid,
  appDataValid,
  ...props
}) => {
  return (
    <>
      <div className="advanced-desc"><T id="login.form.advanced.desc" m="Complete one of the following forms to start Decrediton according to your local setup." /></div>
      <div className="advanced-page-toggle">
        <div className="text-toggle">
          <div className={"text-toggle-button-left " + (sideActive && "text-toggle-button-active")} onClick={!sideActive ? onShowAppData : null}>
            <T id="advancedDaemon.toggle.appdata" m="Remote Daemon" />
          </div>
          <div className={"text-toggle-button-right " + (!sideActive && "text-toggle-button-active")} onClick={sideActive ? onShowRemote : null}>
            <T id="advancedDaemon.toggle.remote" m="Different Local Daemon Location" />
          </div>
        </div>
      </div>
      <div className="advanced-page-form toggle">
        {sideActive ?
          <RemoteDaemonForm {...{
            ...props,
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
            rpcUserHasFailedAttempt,
            rpcPasswordHasFailedAttempt,
            rpcHostHasFailedAttempt,
            rpcPortHasFailedAttempt,
            rpcCertHasFailedAttempt,
            intl
          }}
          /> :
          <AppDataForm {...{
            ...props,
            setAppData,
            appdata,
            appDataHasFailedAttempt,
            intl
          }} />
        }
        <div className="loader-bar-buttons">
          <InvisibleButton onClick={skipAdvancedDaemon}>
            <T id="advancedStartup.skip" m="Skip"/>
          </InvisibleButton>
          { sideActive ?
            <KeyBlueButton onClick={onSubmitRemoteForm} disabled={!remoteValid}>
              <T id="login.form.connect.button" m="Use Remote Daemon" />
            </KeyBlueButton> :
            <KeyBlueButton onClick={onSubmitAppDataForm} disabled={!appDataValid}>
              <T id="login.form.appdata.button" m="Start AppData Daemon" />
            </KeyBlueButton>
          }
        </div>
      </div>
    </>
  );
};

export const AdvancedBody = injectIntl(AdvancedBodyBase);
