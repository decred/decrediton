import React from "react";
import "style/StakePool.less";
import TransitionMotionWrapper from "TransitionMotionWrapper";

const wrapperComponent = props => <div className="account-wrapper" { ...props } />;

const StakeInfoDisplay = ({
  getStakeInfoDetailsStyles,
  getDefaultStyles,
  getStakeInfoRowStyles,
  isShowingDetails,
  willLeave,
  willEnter
}) => {
  const height = !isShowingDetails ? 48 : 180;

  return (
    <TransitionMotionWrapper
      {
      ...{
        defaultStyles: getDefaultStyles(height),
        styles: !isShowingDetails ? getStakeInfoRowStyles() : getStakeInfoDetailsStyles(),
        wrapperComponent,
        willLeave,
        willEnter
      }}
    />
  );
};

export default StakeInfoDisplay;
