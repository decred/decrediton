import { proposals } from "connectors";
import Page from "./Page";
import PoliteiaDisabled from "./PoliteiaDisabled";

@autobind
class Proposals extends React.Component {

  constructor(props) {
    super(props);
    if (!props.activeVoteProposals.length && !props.getActiveVoteProposalsAttempt && props.politeiaEnabled) {
      props.getActiveVoteProposals();
    }
    if (!props.getVettedProposals.length && !props.getVettedProposalsAttempt && props.politeiaEnabled) {
      props.getVettedProposals();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.politeiaEnabled && !this.props.politeiaEnabled) {
      this.props.getVettedProposals();
      this.props.getActiveVoteProposals();
    }
  }

  render() {
    if (!this.props.politeiaEnabled) {
      return <PoliteiaDisabled />;
    }

    return (
      <Page
        {...this.props}
        {...this.state}
      />
    );
  }
}

export default proposals(Proposals);
