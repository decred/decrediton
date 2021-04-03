import { useDispatch } from "react-redux";
import { FormattedMessage as T } from "react-intl";
import { useState, useCallback, useMemo } from "react";
import { useMachine } from "@xstate/react";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { StakeyBounceXs } from "indicators";
import * as gov from "actions/GovernanceActions";
import styles from "./VotePreferenceWrapper.module.css";
import VotePreference from "./VotePreference";

const getError = (error) => {
  if (!error) return;
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    if (error.message) return error.message;
    return JSON.stringify(error);
  }
};

const VotePreferenceWrapper = ({
  viewedProposalDetails,
  voteOptions,
  currentVoteChoice,
  votingComplete
}) => {
  // XXX move all hooks/state logic to a custom hook ie. useVotePreference
  const { eligibleTicketCount } = viewedProposalDetails || {};
  const [newVoteChoice, setVoteOption] = useState(null);

  const dispatch = useDispatch();
  const onUpdateVoteChoice = (privatePassphrase) =>
    dispatch(
      gov.updateVoteChoice(
        viewedProposalDetails,
        newVoteChoice,
        privatePassphrase
      )
    );
  const [state, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => ({}),
      load: (context, event) => {
        const { privatePassphrase } = event;
        if (!newVoteChoice) return;
        onUpdateVoteChoice(privatePassphrase)
          .then(() => send("RESOLVE"))
          .catch((error) => {
            send({ type: "REJECT", error });
            setVoteOption(null);
          });
      }
    }
  });

  const error = useMemo(
    () => state && state.context && getError(state.context.error),
    [state]
  );

  const voteSubmitHandler = useCallback(
    (privatePassphrase) =>
      !error
        ? send({ type: "FETCH", privatePassphrase })
        : send({ type: "RETRY", privatePassphrase }),
    [send, error]
  );

  switch (state.value) {
    case "idle":
    case "failure":
      return (
        <VotePreference
          {...{
            setVoteOption,
            newVoteChoice,
            eligibleTicketCount,
            currentVoteChoice,
            voteOptions,
            votingComplete,
            onVoteSubmit: voteSubmitHandler,
            votedSuccessfully: currentVoteChoice !== "abstain"
          }}
        />
      );
    case "loading":
      return (
        <div className={styles.stakeyWrapper}>
          <StakeyBounceXs />
          <T
            id="proposalDetails.votingInfo.updatingVoteChoice"
            m="Updating vote choice"
          />
          ...
        </div>
      );
    case "success":
      return (
        <VotePreference
          {...{
            setVoteOption,
            newVoteChoice,
            eligibleTicketCount,
            currentVoteChoice,
            voteOptions,
            votingComplete,
            onVoteSubmit: voteSubmitHandler,
            votedSuccessfully: true
          }}
        />
      );
  }
};

export default VotePreferenceWrapper;