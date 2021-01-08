import { useCallback, useMemo, useEffect } from "react";
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
  const isTestnet = useSelector(sel.isTestNet);
  return { tsDate, hasTickets, isTestnet };
};

export const useProposalDetailsPage = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const proposals = useSelector(sel.proposals);
  const proposalsDetails = useSelector(sel.proposalsDetails);
  const getProposalError = useSelector(sel.getProposalError);

  const viewedProposalDetails = useMemo(() => proposalsDetails[token], [
    token,
    proposalsDetails
  ]);

  const linkedProposal = useMemo(() => viewedProposalDetails?.linkto &&
    proposals.finishedVote.find(proposal => viewedProposalDetails.linkto === proposal.token)
    , [
      proposals,
      viewedProposalDetails
    ]);

  const eligibleTicketCount =
    viewedProposalDetails && viewedProposalDetails.walletEligibleTickets
      ? proposalsDetails[token].walletEligibleTickets.length
      : 0;

  const showPurchaseTicketsPage = useCallback(
    () => dispatch(cli.showPurchaseTicketsPage()),
    [dispatch]
  );
  const getProposalDetails = useCallback(
    (token) => dispatch(gov.getProposalDetails(token)),
    [dispatch]
  );
  const goBackHistory = useCallback(() => dispatch(cli.goBackHistory()), [
    dispatch
  ]);

  const [{ value: votingStatus }, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!proposalsDetails[token]) return send("FETCH");
        return send("RESOLVE");
      },
      load: () => {
        getProposalDetails(token)
          .then(() => send({ type: "RESOLVE" }))
          .catch(() => send("REJECT"));
      }
    }
  });

  useEffect(() => {
    send(getProposalError ? "REJECT" : "RETRY");
  }, [getProposalError, send]);

  return {
    viewedProposalDetails,
    eligibleTicketCount,
    votingStatus,
    getProposalError,
    proposalsDetails,
    token,
    dispatch,
    goBackHistory,
    showPurchaseTicketsPage,
    send,
    linkedProposal
  };
};
