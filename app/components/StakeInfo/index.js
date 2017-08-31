// @flow
import React from "react";
import { autobind } from "core-decorators";
import StakeInfoDisplay from "./Display";
import stakeInfo from "../../connectors/stakeInfo";

@autobind
class StakeInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingDetails: false
    };
  }

  render() {
    const { onHideStakeInfo, onShowStakeInfo } = this;
    return (
      <StakeInfoDisplay
        {...{
          ...this.props,
          ...this.state,
          onHideStakeInfo,
          onShowStakeInfo
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
