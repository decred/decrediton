import { proposals } from "connectors";
import Page from "./Page";
import { LoadingProposal, ProposalError, politeiaMarkdownIndexMd } from "./helpers";

@autobind
class ProposalDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      newVoteChoice: null,
      showWalletEligibleTickets: false
    };
  }

  onVoteOptionSelected(opt) {
    this.setState( { newVoteChoice: opt } );
  }

  onUpdateVoteChoice(privatePassphrase) {
    if (!this.state.newVoteChoice) return;
    if (!this.props.viewedProposalDetails) return;

    this.props.updateVoteChoice(this.props.viewedProposalDetails,
      this.state.newVoteChoice, privatePassphrase);
    this.setState( { newVoteChoice: null } );
  }

  onToggleWalletEligibleTickets() {
    this.setState({ showWalletEligibleTickets: !this.state.showWalletEligibleTickets });
  }

  render() {
    const { getProposalAttempt, getProposalError, viewedProposalDetails } = this.props;

    if (getProposalAttempt) return <LoadingProposal />;
    if (getProposalError) return <ProposalError error={getProposalError} />;

    let text = "";
    viewedProposalDetails.files.forEach(f => {
      if (f.name === "index.md") {
        text += politeiaMarkdownIndexMd(f.payload);
      }
    });
    return (
      <Page
        text= {text}
        {...this.props}
        {...this.state}
        onVoteOptionSelected={this.onVoteOptionSelected}
        onUpdateVoteChoice={this.onUpdateVoteChoice}
        onToggleWalletEligibleTickets={this.onToggleWalletEligibleTickets}
      />
    );
  }
}

export default proposals(ProposalDetails);
