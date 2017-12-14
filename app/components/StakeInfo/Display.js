import React from "react";
import "style/StakePool.less";
import TransitionMotionWrapper from "TransitionMotionWrapper";
import StakeInfoRow from "./StakeInfoRow";

const wrapperComponent = props => <div className="account-wrapper" { ...props } />;

const StakeInfoDisplay = ({
  getNullStyles,
  getStakeInfoDetailsComponent,
  isShowingDetails,
  ownMempoolTicketsCount,
  immatureTicketsCount,
  liveTicketsCount,
  onShowStakeInfo,
  onHideStakeInfo
}) => (
    <Aux>
      <StakeInfoRow
        {...{
          isShowingDetails,
          ownMempoolTicketsCount,
          immatureTicketsCount,
          liveTicketsCount,
          onShowStakeInfo,
          onHideStakeInfo
        }}
      />
      <TransitionMotionWrapper
        {
        ...{
          styles: !isShowingDetails ? getNullStyles() : getStakeInfoDetailsComponent(),
          wrapperComponent,
        }}
      />
    </Aux>);

export default StakeInfoDisplay;
