import { Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton, InvisibleButton } from "buttons";
import styles from "./ResendVotesToRecentlyUpdatedVSPs.module.css";
import { useResendVotesToRecentlyUpdatedVSPs } from "./hooks";

const ResendVotesToRecentlyUpdatedVSPs = ({ cancel, send, vsps, votes }) => {
  const { resendVSPDVoteChoicesAttempt, onResendVSPDVoteChoices } =
    useResendVotesToRecentlyUpdatedVSPs();

  const onSubmitContinue = (passphrase) =>
    onResendVSPDVoteChoices(vsps, passphrase)
      .then(() => send({ type: "CONTINUE" }))
      .catch((error) => {
        send({ type: "ERROR", error });
      });

  return (
    <div className={styles.content}>
      <Subtitle
        className={styles.subtitle}
        title={
          <T
            id="getstarted.resendVotesToRecentlyUpdatedVSPs.title"
            m="Resend Votes To Recently Updated VSPs"
          />
        }
      />
      <div className={styles.description}>
        <T
          id="getstarted.resendVotesToRecentlyUpdatedVSPs.description"
          m={
            "The following {count, plural, one {VSP is} other {VSPs are} } upgraded recently and {count, plural, one {it has} other {they have} } > 0 unspent tickets. Since the most recent vote preference update was prior to the upgrading, you need to resend the vote preferences."
          }
          values={{ count: vsps?.length }}
        />
      </div>
      <div>
        <T
          id="getstarted.resendVotesToRecentlyUpdatedVSPs.vspsHeader"
          m="Recently upgraded {count, plural, one {VSP} other {VSPs} }:"
          values={{ count: vsps?.length }}
        />
      </div>
      <ul className={styles.vsps}>
        {vsps?.map((v) => (
          <li key={v.host}>
            {v.host}
            <T
              id="getstarted.resendVotesToRecentlyUpdatedVSPs.tickets"
              m=" ({value, plural, one {# unspent ticket} other {# unspent tickets}})"
              values={{ value: v.tickets?.length }}
            />
          </li>
        ))}
      </ul>

      <div>
        <T
          id="getstarted.resendVotesToRecentlyUpdatedVSPs.votesHeader"
          m="{count, plural, one {Vote} other {Votes} } to be resent:"
          values={{ count: votes?.length }}
        />
      </div>
      <ul className={styles.preference}>
        {votes?.map(({ agendaId, choiceId }) => (
          <li key={agendaId}>
            <div>{agendaId}:</div>
            <span>{choiceId}</span>
          </li>
        ))}
      </ul>

      <div className={styles.buttonWrapper}>
        {!resendVSPDVoteChoicesAttempt && (
          <InvisibleButton className={styles.skipButton} onClick={cancel}>
            <T
              id="process.resendVotesToRecentlyUpdatedVSPs.button.skip"
              m="Skip"
            />
          </InvisibleButton>
        )}
        <PassphraseModalButton
          modalTitle={
            <T
              id="process.resendVotesToRecentlyUpdatedVSPs.title"
              m="Passphrase"
            />
          }
          modalClassName={styles.passphraseModal}
          onSubmit={onSubmitContinue}
          buttonLabel={
            <T
              id="process.resendVotesToRecentlyUpdatedVSPs.button"
              m="Continue"
            />
          }
          disabled={resendVSPDVoteChoicesAttempt}
          loading={resendVSPDVoteChoicesAttempt}
        />
      </div>
    </div>
  );
};

export default ResendVotesToRecentlyUpdatedVSPs;
