import { substruct } from "fp";
import StakeInfoDisplay from "./StakeInfoDisplay";
import stakeInfo from "connectors/stakeInfo";

@autobind
class StakeInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingDetails: false
    };
  }

  render() {
    const {
      ownMempoolTicketsCount,
      immatureTicketsCount,
      liveTicketsCount,
      unspentTicketsCount,
      isSPV,
      lastVotedTicket
    } = this.props;
    return (
      <StakeInfoDisplay
        {...{
          ownMempoolTicketsCount,
          immatureTicketsCount,
          liveTicketsCount,
          unspentTicketsCount,
          isSPV,
          lastVotedTicket,
          ...this.props,
          ...this.state,
          ...substruct(
            {
              getStakeInfoDetailsComponent: null,
              onToggleStakeinfo: null
            },
            this
          )
        }}
      />
    );
  }

  onToggleStakeinfo() {
    this.setState({ isShowingDetails: !this.state.isShowingDetails });
  }
}

export default stakeInfo(StakeInfo);
