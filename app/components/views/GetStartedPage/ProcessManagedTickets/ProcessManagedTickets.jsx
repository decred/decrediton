import { Tooltip, Subtitle } from "shared";
import { GoBackMsg } from "../messages";
import { FormattedMessage as T } from "react-intl";
import GetStartedStyles from "../GetStarted.module.css";
import { useState } from "react";
import { PassphraseModalButton, InvisibleButton } from "buttons";
import styles from "./ProcessUnmanagedTickets.module.css";
import { useEffect } from "react";
import { VSPSelect } from "inputs";

export default ({ cancel, send, onSendContinue, onProcessTickets, title, description, noVspSelection }) => {
  const [isValid, setIsValid] = useState(false);
  const [vsp, setVSP] = useState(null);
  const onSubmitContinue = async (passphrase) => {
    // send a continue so we can go to the loading state
    onSendContinue();
    await onProcessTickets(passphrase).then(() => send({ type: "CONTINUE" }));
    return;
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
            <T id="process.mangedTickets.title" m="Passphrase" />
          }
          modalClassName={styles.passphraseModal}
          onSubmit={onSubmitContinue}
          buttonLabel={<T id="process.mangedTickets.button" m="Continue" />}
          disabled={!isValid}>

        </PassphraseModalButton>
        <InvisibleButton className={styles.skipButton} onClick={cancel}>
          <T
            id="process.mangedTickets.button.skip"
            m="Skip"
          />
        </InvisibleButton>
      </div>
    </div>
  );
};
