import { spring } from "react-motion";
import { substruct } from "fp";
import StakeInfoDisplay from "./Display";
import StakeInfoDetails from "./StakeInfoDetails";
import stakeInfo from "connectors/stakeInfo";

@autobind
class StakeInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingDetails: false
    };
  }

  getDefaultStyles(height) {
    return [{ key: "output_0",style: {height: height, opacity: 0}}];
  }

  getStakeInfoDetailsComponent () {
    const {
      ticketPoolSize,
      votedTicketsCount,
      allMempoolTicketsCount,
      missedTicketsCount,
      ownMempoolTicketsCount,
      revokedTicketsCount,
      immatureTicketsCount,
      expiredTicketsCount,
      totalSubsidy,
      liveTicketsCount,
     } = this.props;
    const { onHideStakeInfo, onShowStakeInfo } = this;
    const { isShowingDetails } = this.state;
    return [{
      data: <StakeInfoDetails
        {...{
          isShowingDetails,
          ticketPoolSize,
          votedTicketsCount,
          allMempoolTicketsCount,
          missedTicketsCount,
          ownMempoolTicketsCount,
          revokedTicketsCount,
          immatureTicketsCount,
          expiredTicketsCount,
          totalSubsidy,
          liveTicketsCount,
          onHideStakeInfo,
          onShowStakeInfo,
        }}
      />,
      key: "output_0",
      style: {
        height: spring(150, {stiffness: 170, damping: 15}),
        opacity: spring(1, {stiffness: 100, damping: 20}),
      }
    }];
  }

  getNullStyles() {
    return [{
      data: null,
      key: "output_0",
      style: {
        height: spring(0, {stiffness: 100, damping: 14}),
        opacity: spring(0, {stiffness: 100, damping: 20}),
      }
    }];
  }

  willLeave() {
    return {
      opacity: spring(0, {stiffness: 60, damping: 14}),
    };
  }

  render() {
    const {
      ownMempoolTicketsCount,
      immatureTicketsCount,
      liveTicketsCount,
     } = this.props;
    return (
      <StakeInfoDisplay
        {...{
          ownMempoolTicketsCount,
          immatureTicketsCount,
          liveTicketsCount,
          ...this.props,
          ...this.state,
          ...substruct({
            onHideStakeInfo: null,
            onShowStakeInfo: null,
            getStakeInfoDetailsComponent: null,
            getNullStyles: null,
            getDefaultStyles: null,
            willLeave: null,
            willEnter: null,
          }, this)
        }}
      />
    );
  }

  onHideStakeInfo() {
    this.setState({ isShowingDetails: false });
  }

  onShowStakeInfo() {
    this.setState({ isShowingDetails: true });
  }
}

export default stakeInfo(StakeInfo);
