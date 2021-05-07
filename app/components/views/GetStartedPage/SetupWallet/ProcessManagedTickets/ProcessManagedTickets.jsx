import { useState, useEffect } from "react";
import { Tooltip } from "pi-ui";
import { Subtitle } from "shared";
import { GoBackMsg } from "../../messages";
import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton, InvisibleButton } from "buttons";
import { BackButton, BackButtonArea } from "../../helpers";
import styles from "./ProcessUnmanagedTickets.module.css";
import { VSPSelect } from "inputs";

export default ({
  cancel,
  send,
  onProcessTickets,
  title,
  description,
  noVspSelection,
  error,
  isProcessingManaged
}) => {
  const [isValid, setIsValid] = useState(false);
  const [vsp, setVSP] = useState(null);

  const onSubmitContinue = (passphrase) => {
    // send a continue so we can go to the loading state
    onProcessTickets(passphrase)
      .then(() => send({ type: "CONTINUE" }))
      .catch((error) => {
        send({ type: "ERROR", error });
      });
    return;
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

  console.log("LLLLLLL processing managed", isProcessingManaged);

  return (
    <div className={styles.content}>
      <BackButtonArea>
        {!isProcessingManaged && (
          <Tooltip content={<GoBackMsg />}>
            <BackButton onClick={cancel} />
          </Tooltip>
        )}
      </BackButtonArea>
      <Subtitle className={styles.subtitle} title={title} />
      <div className={styles.description}>{description}</div>
      {!noVspSelection && (
        <VSPSelect className={styles.vspSelect} {...{ onChange: setVSP }} />
      )}
      {error && <div className="error">{error}</div>}
      <div className={styles.buttonWrapper}>
        <PassphraseModalButton
          modalTitle={<T id="process.mangedTickets.title" m="Passphrase" />}
          modalClassName={styles.passphraseModal}
          onSubmit={onSubmitContinue}
          buttonLabel={<T id="process.mangedTickets.button" m="Continue" />}
          disabled={!isValid || isProcessingManaged}
          loading={isProcessingManaged}
        />
        {!isProcessingManaged && (
          <InvisibleButton className={styles.skipButton} onClick={cancel}>
            <T id="process.mangedTickets.button.skip" m="Skip" />
          </InvisibleButton>
        )}
      </div>
    </div>
  );
};
