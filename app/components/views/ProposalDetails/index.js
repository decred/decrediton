import { proposals } from "connectors";
import Page from "./Page";
import { ProposalError, politeiaMarkdownIndexMd } from "./helpers";
import { PoliteiaLoading } from "indicators";
import { useState } from "react";
import * as sel from "selectors";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import * as gov from "actions/GovernanceActions";
import * as cli from "actions/ClientActions";

function ProposalDetails() {
  const dispatch = useDispatch();
  const [ showWalletEligibleTickets, toggleShowWalletEligibleTickets] = useState(false);
  const [ newVoteChoice, setVoteOption ] = useState(null);
  const { token } = useParams();
  const proposalsDetails = useSelector(sel.proposalsDetails);
  const getProposalDetails = (token) => dispatch(gov.getProposalDetails(token));
  const goBackHistory = () => dispatch(cli.goBackHistory());
  const [ state, send ] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!proposalsDetails[token]) return send("FETCH");
        return send("RESOLVE");
      },
      load: () => {
        getProposalDetails(token).then(res => {
          send({ type: "RESOLVE" });
        });
      }
    }
  });
  const getProposalError =  useSelector(sel.getProposalError);
  let text = "";
  let viewedProposalDetails;

  switch (state.value) {
    case "idle":
      return <></>;
    case "loading":
      return <div className="proposal-loading-page"><PoliteiaLoading /></div>;
    case "success":
      viewedProposalDetails = proposalsDetails[token];
      console.log(viewedProposalDetails)
      viewedProposalDetails.files.forEach(f => {
        if (f.name === "index.md") {
          text += politeiaMarkdownIndexMd(f.payload);
        }
      });
      return (
        <Page {...{
          newVoteChoice, showWalletEligibleTickets, text, viewedProposalDetails,
          goBackHistory,
        }}
            onVoteOptionSelected={setVoteOption}
            // onUpdateVoteChoice={this.onUpdateVoteChoice}
            onToggleWalletEligibleTickets={toggleShowWalletEligibleTickets}
          />
      );
    case "failure":
      return <ProposalError error={getProposalError} />;
    default:
      return null;
    }
  return 
}

// @autobind
// class ProposalDetails extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       newVoteChoice: null,
//       showWalletEligibleTickets: false
//     };
//   }

//   onVoteOptionSelected(opt) {
//     this.setState( { newVoteChoice: opt } );
//   }

//   onUpdateVoteChoice(privatePassphrase) {
//     if (!this.state.newVoteChoice) return;
//     if (!this.props.viewedProposalDetails) return;

//     this.props.updateVoteChoice(this.props.viewedProposalDetails,
//       this.state.newVoteChoice, privatePassphrase);
//     this.setState( { newVoteChoice: null } );
//   }

//   onToggleWalletEligibleTickets() {
//     this.setState({ showWalletEligibleTickets: !this.state.showWalletEligibleTickets });
//   }

//   render() {

//     );
//   }
// }

export default ProposalDetails;
