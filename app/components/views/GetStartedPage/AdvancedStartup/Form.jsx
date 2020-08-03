import { useCallback } from "react";
import { KeyBlueButton, InvisibleButton } from "buttons";
import RemoteDaemonForm from "./RemoteDaemonForm";
import AppDataForm from "./AppDataForm";
import { FormattedMessage as T, injectIntl } from "react-intl";
import { Toggle, classNames } from "pi-ui";
import styles from "../GetStarted.module.css";

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
  const onFormModeToggle = useCallback(() => {
    sideActive ? onShowRemote() : onShowAppData();
  }, [sideActive, onShowAppData, onShowRemote]);

  return (
    <>
      <div className={styles.advancedDesc}>
        <T
          id="login.form.advanced.desc"
          m="Complete one of the following forms to start Decrediton according to your local setup."
        />
      </div>
      <div className={styles.toggleWrapper}>
        <Toggle onToggle={onFormModeToggle} toggled={!sideActive} />
        <div className={styles.toggleLabel}>
          Different Local Daemon Location
        </div>
      </div>
      <div className={classNames(styles.pageForm, styles.toggle)}>
        {sideActive ? (
          <RemoteDaemonForm
            {...{
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
          />
        ) : (
          <AppDataForm
            {...{
              ...props,
              setAppData,
              appdata,
              appDataHasFailedAttempt,
              intl
            }}
          />
        )}
        <div className={styles.loaderBarButtons}>
          <InvisibleButton onClick={skipAdvancedDaemon}>
            <T id="advancedStartup.skip" m="Skip" />
          </InvisibleButton>
          {sideActive ? (
            <KeyBlueButton onClick={onSubmitRemoteForm} disabled={!remoteValid}>
              <T id="login.form.connect.button" m="Use Remote Daemon" />
            </KeyBlueButton>
          ) : (
            <KeyBlueButton
              onClick={onSubmitAppDataForm}
              disabled={!appDataValid}>
              <T id="login.form.appdata.button" m="Start AppData Daemon" />
            </KeyBlueButton>
          )}
        </div>
      </div>
    </>
  );
};

export const AdvancedBody = injectIntl(AdvancedBodyBase);
