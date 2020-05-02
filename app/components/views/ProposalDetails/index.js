import { useEffect } from "react";
import Page from "./Page";
import { politeiaMarkdownIndexMd } from "./helpers";
import { PoliteiaLoading } from "indicators";
import * as sel from "selectors";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import * as gov from "actions/GovernanceActions";
import * as cli from "actions/ClientActions";
import { LoadingError } from "shared";

const Header = ({ eligibleTicketCount }) => <StandaloneHeader
  title={<T id="proposal.details.title" m="Governance" />}
  description={<T id="proposal.details.description"
    m={"Your voting power: {votingPower}"}
    values={{ votingPower: eligibleTicketCount }}
  />}
  iconClassName="governance"
/>;

function ProposalDetails() {
  const dispatch = useDispatch();
  let text = "";

  const { token } = useParams();
  const proposalsDetails = useSelector(sel.proposalsDetails);
  const getProposalError = useSelector(sel.getProposalError);

  const viewedProposalDetails = proposalsDetails[token];
  const eligibleTicketCount = viewedProposalDetails && viewedProposalDetails.walletEligibleTickets ?
    proposalsDetails[token].walletEligibleTickets.length : 0;
  const getProposalDetails = (token) => dispatch(gov.getProposalDetails(token));
  const goBackHistory = () => dispatch(cli.goBackHistory());

  const [state, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!proposalsDetails[token]) return send("FETCH");
        return send("RESOLVE");
      },
      load: () => {
        getProposalDetails(token).then(() => send({ type: "RESOLVE" })).catch(() => send("REJECT"));
      }
    }
  });
  useEffect(() => {
    if (getProposalError) send("REJECT");
  }, [getProposalError]);

  const getStateComponent = () => {
    switch (state.value) {
      case "idle":
        return <></>;
      case "loading":
        return <div className="proposal-loading-page"><PoliteiaLoading /></div>;
      case "success":
        viewedProposalDetails.files.forEach(f => {
          if (f.name === "index.md") {
            text += politeiaMarkdownIndexMd(f.payload);
          }
        });
        return <Page {...{ text, viewedProposalDetails, goBackHistory, eligibleTicketCount }} />;
      case "failure":
        return (
          <LoadingError errorMessageDescription={String(getProposalError)} reload={() => { send("RETRY") }} />
        );
      default:
        return null;
    }
  };

  return (
    <StandalonePage header={Header({ eligibleTicketCount })}>
      {getStateComponent()}
    </StandalonePage>
  );

}

export default ProposalDetails;
