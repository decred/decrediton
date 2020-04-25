import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as gov from "actions/GovernanceActions";
import * as cli from "actions/ClientActions";
import { useParams } from "react-router-dom";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";

export const useProposalDetails = () => {
  const tsDate = useSelector(sel.tsDate);
  const hasTickets = useSelector(sel.hasTickets);
  return { tsDate, hasTickets };
};

export const useProposalDetailsPage = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const proposalsDetails = useSelector(sel.proposalsDetails);
  const getProposalError =  useSelector(sel.getProposalError);
  const getProposalDetails = (token) => dispatch(gov.getProposalDetails(token));
  const goBackHistory = useCallback(() => dispatch(cli.goBackHistory()), [ dispatch ]);
  const [ { value: votingStatus }, send ] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!proposalsDetails[token]) return send("FETCH");
        return send("RESOLVE");
      },
      load: () => {
        getProposalDetails(token).then(() => send({ type: "RESOLVE" }));
      }
    }
  });

  return { votingStatus, getProposalError, proposalsDetails, token, dispatch, goBackHistory };
};
