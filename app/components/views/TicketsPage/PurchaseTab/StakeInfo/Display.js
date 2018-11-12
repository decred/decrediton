import { TransitionMotionWrapper } from "shared";
import StakeInfoRow from "./StakeInfoRow";
import "style/StakePool.less";

const wrapperComponent = props => <div { ...props } />;

const StakeInfoDisplay = ({
  getNullStyles,
  getStakeInfoDetailsComponent,
  isShowingDetails,
  ownMempoolTicketsCount,
  unspentTicketsCount,
  immatureTicketsCount,
  liveTicketsCount,
  isSPV,
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
        unspentTicketsCount,
        isSPV,
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
