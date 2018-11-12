import { spring } from "react-motion";
import { substruct } from "fp";
import StakeInfoDisplay from "./Display";
import StakeInfoDetails from "./StakeInfoDetails";
import StakeInfoDetailsSPV from "./StakeInfoDetailsSPV";
import stakeInfo from "connectors/stakeInfo";

@autobind
class StakeInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingDetails: false
    };
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
      unspentTicketsCount,
    } = this.props;
    const { onHideStakeInfo, onShowStakeInfo } = this;
    const { isShowingDetails } = this.state;
    const { isSPV } = this.props;
    return [ {
      data: isSPV ?
        <StakeInfoDetailsSPV
          {...{
            isShowingDetails,
            votedTicketsCount,
            ownMempoolTicketsCount,
            revokedTicketsCount,
            immatureTicketsCount,
            expiredTicketsCount,
            totalSubsidy,
            unspentTicketsCount,
            onHideStakeInfo,
            onShowStakeInfo,
          }}
        /> :
        <StakeInfoDetails
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
        height: spring(150, { stiffness: 170, damping: 15 }),
        opacity: spring(1, { stiffness: 100, damping: 20 }),
      }
    } ];
  }

  getNullStyles() {
    return [ {
      data: null,
      key: "output_0",
      style: {
        height: spring(0, { stiffness: 100, damping: 14 }),
        opacity: spring(0, { stiffness: 100, damping: 20 }),
      }
    } ];
  }

  render() {
    const {
      ownMempoolTicketsCount,
      immatureTicketsCount,
      liveTicketsCount,
      unspentTicketsCount,
      isSPV,
    } = this.props;
    return (
      <StakeInfoDisplay
        {...{
          ownMempoolTicketsCount,
          immatureTicketsCount,
          liveTicketsCount,
          unspentTicketsCount,
          isSPV,
          ...this.props,
          ...this.state,
          ...substruct({
            onHideStakeInfo: null,
            onShowStakeInfo: null,
            getStakeInfoDetailsComponent: null,
            getNullStyles: null,
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
