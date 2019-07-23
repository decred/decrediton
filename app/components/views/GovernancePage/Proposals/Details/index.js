import { proposals } from "connectors";
import Page from "./Page";
import { LoadingProposal, ProposalError, politeiaMarkdownIndexMd } from "./helpers";

@autobind
class ProposalDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      newVoteChoice: null,
      text: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { viewedProposalDetails } = this.props;
    let text = "";
    if (prevProps.viewedProposalDetails !== viewedProposalDetails && viewedProposalDetails.files.length) {
      viewedProposalDetails.files.forEach(f => {
        if (f.name === "index.md") {
          text = politeiaMarkdownIndexMd(f.payload);
        }
      });
      this.setState({ text });
    }
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

  render() {
    const { getProposalAttempt, getProposalError } = this.props;

    if (getProposalAttempt) return <LoadingProposal />;
    if (getProposalError) return <ProposalError error={getProposalError} />;

    return (
      <Page
        {...this.props}
        {...this.state}
        onVoteOptionSelected={this.onVoteOptionSelected}
        onUpdateVoteChoice={this.onUpdateVoteChoice}
      />
    );
  }
}

export default proposals(ProposalDetails);
