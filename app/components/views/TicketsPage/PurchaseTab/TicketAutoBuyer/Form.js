import { FormattedMessage as T } from "react-intl";
import Details from "./Details";
import QuickBar from "./QuickBar";
import "style/StakePool.less";

const TicketAutoBuyerForm = ({
  isHidingDetails,
  balanceToMaintain,
  maxFee,
  maxPriceAbsolute,
  maxPriceRelative,
  maxPerBlock,

  onStartAutoBuyer,
  onDisableTicketAutoBuyer,
  onToggleShowDetails,
  isTicketAutoBuyerEnabled,
  
  isTicketAutoBuyerConfigDirty,
  getTicketBuyerConfigResponse,
  formatMessage,
  maxFeeError,
  balanceToMaintainError,
  maxPriceAbsoluteError,
  maxPriceRelativeError,
  onChangeBalanceToMaintain,
  onChangeMaxFee,
  onChangeMaxPriceAbsolute,
  onChangeMaxPriceRelative,
  onChangeMaxPerBlock,
  onUpdateTicketAutoBuyerConfig,
  canNotEnableAutobuyer,
}) => (
    <Aux>
      <div className="stakepool-voting-title-area">
        <div className="stakepool-voting-title-area-name">
          <T id="autobuyer.title" m="Automatic Purchase" /></div>
      </div>
      <div className={isHidingDetails ? "stakepool-flex-height-auto-buyer-hidden" : "stakepool-flex-height-auto-buyer-shown"}>
        <QuickBar {...{
          isHidingDetails,
          onStartAutoBuyer,
          onDisableTicketAutoBuyer,
          onToggleShowDetails,
          isTicketAutoBuyerEnabled,
          balanceToMaintain,
          maxFee,
          maxPriceAbsolute,
          maxPriceRelative,
          maxPerBlock
        }}
        
        />
        <Details {...{
          isTicketAutoBuyerConfigDirty,
          getTicketBuyerConfigResponse,
          formatMessage,
          maxFeeError,
          balanceToMaintainError,
          maxPriceAbsoluteError,
          maxPriceRelativeError,
          onChangeBalanceToMaintain,
          onChangeMaxFee,
          onChangeMaxPriceAbsolute,
          onChangeMaxPriceRelative,
          onChangeMaxPerBlock,
          onUpdateTicketAutoBuyerConfig,
          canNotEnableAutobuyer,
          isHidingDetails,
          balanceToMaintain,
          maxFee,
          maxPriceAbsolute,
          maxPriceRelative,
          maxPerBlock
        }}
        />
      </div>
    </Aux>
  );

export default TicketAutoBuyerForm;
