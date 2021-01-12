import { Tooltip, Subtitle } from "shared";
import { GoBackMsg } from "../messages";
import { FormattedMessage as T } from "react-intl";
import GetStartedStyles from "../GetStarted.module.css";
import { useState } from "react";
import { PassphraseModalButton } from "buttons";
import styles from "./ProcessUnmanagedTickets.module.css";
import { useEffect } from "react";
import { VSPSelect } from "inputs";

export default ({ cancel, onSendContinue, onProcessTickets, title, description, noVspSelection }) => {
  const [isValid, setIsValid] = useState(false);
  const [vsp, setVSP] = useState(null);
  const onSubmitContinue = async (passphrase) => {
    // send a continue to go to the loading state
    onSendContinue();
    await onProcessTickets(passphrase, vsp.host, vsp.pubkey);
    onSendContinue();
  };

  useEffect(() => {
    if (noVspSelection) {
      setIsValid(true);
      return;
    }
    if(vsp) {
      setIsValid(true);
    }
  }, [vsp, noVspSelection]);

  return (
    <div className={styles.content}>
      <div className={GetStartedStyles.goBackScreenButtonArea}>
        <Tooltip text={<GoBackMsg />}>
          <div
            className={GetStartedStyles.goBackScreenButton}
            onClick={cancel}
          />
        </Tooltip>
      </div>
      <Subtitle
        className={styles.subtitle}
        title={title}
      />
      <div className={styles.description}>
        {description}
      </div>
      { !noVspSelection && <VSPSelect
          className={styles.vspSelect}
          {...{ onChange: setVSP }}
        />
      }
      <div className={styles.buttonWrapper}>
        <PassphraseModalButton
          modalTitle={
            <T id="process.unmangedTickets.title" m="Passphrase" />
          }
          modalClassName={styles.passphraseModal}
          onSubmit={onSubmitContinue}
          buttonLabel={<T id="process.unmangedTickets.button" m="Continue" />}
          disabled={!isValid}>

        </PassphraseModalButton>
      </div>
    </div>
  );
};
