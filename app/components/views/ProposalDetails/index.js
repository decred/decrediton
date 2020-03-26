import Page from "./Page";
import { ProposalError, politeiaMarkdownIndexMd } from "./helpers";
import { PoliteiaLoading } from "indicators";
import * as sel from "selectors";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import * as gov from "actions/GovernanceActions";
import * as cli from "actions/ClientActions";

function ProposalDetails() {
  const dispatch = useDispatch();
  let viewedProposalDetails;
  let text = "";

  const { token } = useParams();
  const proposalsDetails = useSelector(sel.proposalsDetails);
  const getProposalError =  useSelector(sel.getProposalError);

  const getProposalDetails = (token) => dispatch(gov.getProposalDetails(token));
  const goBackHistory = () => dispatch(cli.goBackHistory());

  const [ state, send ] = useMachine(fetchMachine, {
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

  switch (state.value) {
  case "idle":
    return <></>;
  case "loading":
    return <div className="proposal-loading-page"><PoliteiaLoading /></div>;
  case "success":
    viewedProposalDetails = proposalsDetails[token];
    viewedProposalDetails.files.forEach(f => {
      if (f.name === "index.md") {
        text += politeiaMarkdownIndexMd(f.payload);
      }
    });
    return <Page {...{ text, viewedProposalDetails, goBackHistory }} />;
  case "failure":
    return <ProposalError error={getProposalError} />;
  default:
    return null;
  }
}

export default ProposalDetails;
