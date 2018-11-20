import { proposals } from "connectors";
import { Route, Switch } from "react-router-dom";
import Page from "./Page";
import ProposalDetails from "./Details";
import PoliteiaDisabled from "./PoliteiaDisabled";

@autobind
class Proposals extends React.Component {

  constructor(props) {
    super(props);
    const now = new Date();
    const msLastReq = (now - props.lastVettedFetchTime);
    const vettedTooOld = msLastReq > (5 * 60 * 1000); // 5 minutes
    if (!props.getVettedProposalsAttempt && props.politeiaEnabled && vettedTooOld) {
      props.getVettedProposals();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.politeiaEnabled && !prevProps.politeiaEnabled) {
      this.props.getVettedProposals();
    }
  }

  render() {
    if (!this.props.politeiaEnabled) {
      return <PoliteiaDisabled />;
    }

    return (
      <Switch>
        <Route path="/governance/proposals/details/:token" component={ProposalDetails}/>
        <Route path="/governance/proposals" component={Page} />
      </Switch>
    );
  }
}

export default proposals(Proposals);
