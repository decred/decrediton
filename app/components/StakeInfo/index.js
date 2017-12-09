import React from "react";
import { autobind } from "core-decorators";
import { spring } from "react-motion";
import { substruct } from "fp";
import StakeInfoDisplay from "./Display";
import StakeInfoDetails from "./StakeInfoDetails";
import stakeInfo from "connectors/stakeInfo";
import StakeInfoRow from "./StakeInfoRow";

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

  getStakeInfoDetailsStyles () {
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
    const { onHideStakeInfo } = this;
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
        }}
      />,
      key: "output_0",
      style: {
        height: spring(180, {stiffness: 170, damping: 15}),
      }
    }];
  }

  getStakeInfoRowStyles() {
    const {
      ownMempoolTicketsCount,
      immatureTicketsCount,
      liveTicketsCount,
     } = this.props;
    const { onShowStakeInfo } = this;
    return [{
      data: <StakeInfoRow {...{
        ownMempoolTicketsCount,
        immatureTicketsCount,
        liveTicketsCount,
        onShowStakeInfo
      }}/>,
      key: "output_0",
      style: {
        height: spring(50, {stiffness: 100, damping: 14}),
      }
    }];
  }

  willLeave() {
    return {
      opacity: spring(0, {stiffness: 60, damping: 14}),
    };
  }

  render() {
    return (
      <StakeInfoDisplay
        {...{
          ...this.props,
          ...this.state,
          ...substruct({
            onHideStakeInfo: null,
            onShowStakeInfo: null,
            getStakeInfoDetailsStyles: null,
            getDefaultStyles: null,
            getStakeInfoRowStyles: null,
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
