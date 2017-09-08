import React from "react";
import { autobind } from "core-decorators";
import { substruct } from "../../fp";
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
    return (
      <StakeInfoDisplay
        {...{
          ...this.props,
          ...this.state,
          ...substruct({
            onHideStakeInfo: null,
            onShowStakeInfo: null
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
