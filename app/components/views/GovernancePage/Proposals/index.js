import { proposals } from "connectors";
import { Route, Switch } from "react-router-dom";
import ProposalList from "./ProposalList";
import ProposalDetails from "./Details";
import PoliteiaDisabled from "./PoliteiaDisabled";

@autobind
class Proposals extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    console.log(this.props)
  }

  render() {
    if (!this.props.politeiaEnabled) {
      return <PoliteiaDisabled />;
    }

    return (
      <Switch>
        <Route path="/governance/proposals/details/:token" component={ProposalDetails}/>
        <Route path="/governance/proposals" component={ProposalList} />
      </Switch>
    );
  }
}

export default proposals(Proposals);
