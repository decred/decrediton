import { Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton, InvisibleButton } from "buttons";
import styles from "./ProcessUnmanagedTickets.module.css";
import { useDaemonStartup } from "hooks";

export default ({ cancel, send, error }) => {
  const { onProcessManagedTickets, isProcessingManaged } = useDaemonStartup();

  const onSubmitContinue = (passphrase) => {
    // send a continue so we can go to the loading state
    onProcessManagedTickets(passphrase)
      .then(() => send({ type: "CONTINUE" }))
      .catch((error) => {
        send({ type: "ERROR", error });
      });
    return;
  };

  return (
    <div className={styles.content}>
      <Subtitle
        className={styles.subtitle}
        title={
          <T
            id="getstarted.processManagedTickets.title"
            m="Process Managed Tickets"
          />
        }
      />
      <div className={styles.description}>
        {
          <T
            id="getstarted.processManagedTickets.description"
            m={`Your wallet appears to have live tickets. Processing managed
                 tickets confirms with the VSPs that all of your submitted tickets
                 are currently known and paid for by the VSPs. If you've already
                 confirmed your tickets then you may skip this step.`}
          />
        }
      </div>
      {error && <div className="error">{error}</div>}
      <div className={styles.buttonWrapper}>
        <PassphraseModalButton
          modalTitle={<T id="process.mangedTickets.title" m="Passphrase" />}
          modalClassName={styles.passphraseModal}
          onSubmit={onSubmitContinue}
          buttonLabel={<T id="process.mangedTickets.button" m="Continue" />}
          disabled={isProcessingManaged}
          loading={isProcessingManaged}
        />
        <InvisibleButton
          className={styles.skipButton}
          onClick={cancel}
          disabled={isProcessingManaged}>
          <T id="process.mangedTickets.button.skip" m="Skip" />
        </InvisibleButton>
      </div>
    </div>
  );
};
