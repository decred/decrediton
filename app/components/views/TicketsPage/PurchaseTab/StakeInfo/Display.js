import { TransitionMotionWrapper } from "shared";
import StakeInfoRow from "./StakeInfoRow";
import "style/StakePool.less";

const wrapperComponent = props => <div { ...props } />;

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
