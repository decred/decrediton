import { useDispatch } from "react-redux";
import { useState, useCallback, useMemo } from "react";
import { useMachine } from "@xstate/react";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import * as gov from "actions/GovernanceActions";
import { isString, isObject } from "lodash";

const getError = (error) => {
  if (!error) return;
  if (isString(error)) return error;
  if (isObject(error)) {
    if (error.message) return error.message;
    return JSON.stringify(error);
  }
};

export const useVotePreference = (viewedProposalDetails) => {
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

  return {
    setVoteOption,
    newVoteChoice,
    state,
    voteSubmitHandler,
    eligibleTicketCount
  };
};
