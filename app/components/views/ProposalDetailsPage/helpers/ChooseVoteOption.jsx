import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import { StakeyBounceXs } from "indicators";
import { useDispatch } from "react-redux";
import { useState, useCallback, useMemo } from "react";
import * as gov from "actions/GovernanceActions";
import styles from "../ProposalDetails.module.css";
import ChooseOptions from "./ChooseOptions";
import { FormattedMessage as T } from "react-intl";

const getError = (error) => {
  if (!error) return;
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    if (error.message) return error.message;
    return JSON.stringify(error);
  }
};

const ChooseVoteOption = ({
  viewedProposalDetails,
  voteOptions,
  currentVoteChoice,
  votingComplete,
  eligibleTicketCount
}) => {
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
        <ChooseOptions
          {...{
            setVoteOption,
            newVoteChoice,
            eligibleTicketCount,
            currentVoteChoice,
            voteOptions,
            votingComplete,
            onVoteSubmit: voteSubmitHandler
          }}
        />
      );
    case "loading":
      return (
        <div className={styles.voteChoice}>
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
        <ChooseOptions
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

export default ChooseVoteOption;
