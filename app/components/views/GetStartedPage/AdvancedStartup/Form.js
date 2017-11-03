import Header from "Header";
import KeyBlueButton from "KeyBlueButton";
import RemoteDaemonForm from "./RemoteDaemonForm";
import AppDataForm from "./AppDataForm";
import { FormattedMessage as T, injectIntl } from "react-intl";
import "style/LoginForm.less";

export const AdvancedHeader = () => (
  <Header getStarted
    headerTitleOverview={<T id="getStarted.advanced.title" m="Advanced Start Up" />}
    headerMetaOverview={<T id="getStarted.advanced.meta" m="Please complete one of the following forms to start Decrediton according to your local setup." />} />
);

const AdvancedBodyBase = ({
  ...props,
  ...state,
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
  intl
 }) => {
  return (
    <Aux>
      <div className="advanced-page-toggle">
        <div className="text-toggle">
          <div className="text-toggle-button-left text-toggle-button-active">
            <T id="advancedDaemon.toggle.remote" m="Remote Daemon" />
          </div>
          <div className="text-toggle-button-right">
            <T id="advancedDaemon.toggle.appdata" m="Different Local Daemon Location" />
          </div>
        </div>
      </div>
      <div className="login-form-wrapper">
        <div className="login-forms-wrapper">
          <RemoteDaemonForm {...{
            ...props,
            ...state,
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
          />
          <AppDataForm {...{
            ...props,
            ...state,
            onSubmitAppDataForm,
            setAppData,
            appData,
            intl
          }} />
        </div>
        <KeyBlueButton onClick={skipAdvancedDaemon}>
          <T id="advancedStartup.skip" m="Skip Advanced Daemon Connection"/>
        </KeyBlueButton>
      </div>
    </Aux>
  );
};

export const AdvancedBody = injectIntl(AdvancedBodyBase);
