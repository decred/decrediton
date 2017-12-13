import React from "react";
import "style/StakePool.less";
import TransitionMotionWrapper from "TransitionMotionWrapper";
import StakeInfoRow from "./StakeInfoRow";

const wrapperComponent = props => <div className="account-wrapper" { ...props } />;

const StakeInfoDisplay = ({
  getNullStyles,
  getDefaultStyles,
  getStakeInfoDetailsComponent,
  isShowingDetails,
  willLeave,
  willEnter,
  ownMempoolTicketsCount,
  immatureTicketsCount,
  liveTicketsCount,
  onShowStakeInfo,
  onHideStakeInfo
}) => {
  const height = !isShowingDetails ? 48 : 180;

  return (
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
          defaultStyles: getDefaultStyles(height),
          styles: !isShowingDetails ? getNullStyles() : getStakeInfoDetailsComponent(),
          wrapperComponent,
          willLeave,
          willEnter
        }}
      />
    </Aux>

  );
};

export default StakeInfoDisplay;
