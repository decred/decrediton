import { useState, useEffect } from "react";
import { Tooltip } from "pi-ui";
import { Subtitle } from "shared";
import { GoBackMsg } from "../../messages";
import { FormattedMessage as T } from "react-intl";
import GetStartedStyles from "../../GetStarted.module.css";
import { PassphraseModalButton, InvisibleButton } from "buttons";
import styles from "./ProcessUnmanagedTickets.module.css";
import { VSPSelect } from "inputs";

export default ({
  cancel,
  send,
  onProcessTickets,
  title,
  description,
  noVspSelection,
  isProcessingUnmanaged,
  error
}) => {
  const [isValid, setIsValid] = useState(false);
  const [vsp, setVSP] = useState(null);
  const onSubmitContinue = (passphrase) => {
    onProcessTickets(passphrase, vsp.host, vsp.pubkey)
      .then(() => send({ type: "CONTINUE" }))
      .catch((error) => {
        send({ type: "ERROR", error });
      });
  };

  useEffect(() => {
    if (noVspSelection) {
      setIsValid(true);
      return;
    }
    if (vsp) {
      setIsValid(true);
    }
  }, [vsp, noVspSelection]);

  return (
    <div className={styles.content}>
      <div className={GetStartedStyles.goBackScreenButtonArea}>
        {isProcessingUnmanaged && (
          <Tooltip content={<GoBackMsg />}>
            <div
              className={GetStartedStyles.goBackScreenButton}
              onClick={cancel}
            />
          </Tooltip>
        )}
      </div>
      <Subtitle className={styles.subtitle} title={title} />
      <div className={styles.description}>{description}</div>
      {!noVspSelection && (
        <VSPSelect className={styles.vspSelect} {...{ onChange: setVSP }} />
      )}
      {error && <div className="error">{error}</div>}
      <div className={styles.buttonWrapper}>
        <PassphraseModalButton
          modalTitle={<T id="process.unmangedTickets.title" m="Passphrase" />}
          modalClassName={styles.passphraseModal}
          onSubmit={onSubmitContinue}
          buttonLabel={<T id="process.unmangedTickets.button" m="Continue" />}
          disabled={!isValid || isProcessingUnmanaged}
          loading={isProcessingUnmanaged}
        />
        {!isProcessingUnmanaged && (
          <InvisibleButton className={styles.skipButton} onClick={cancel}>
            <T id="process.unmanagedTickets.button.skip" m="Skip" />
          </InvisibleButton>
        )}
      </div>
    </div>
  );
};
