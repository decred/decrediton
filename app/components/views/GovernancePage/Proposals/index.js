import { proposals } from "connectors";
import { Route, Switch } from "react-router-dom";
import Page from "./Page";
import ProposalDetails from "./Details";
import PoliteiaDisabled from "./PoliteiaDisabled";

@autobind
class Proposals extends React.Component {

  constructor(props) {
    super(props);
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
