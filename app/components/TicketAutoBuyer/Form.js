import React from "react";
import TicketsCogs from "../TicketsCogs";
import AutoBuyerSwitch from "../AutoBuyerSwitch";
import KeyBlueButton from "../KeyBlueButton";
import "../../style/StakePool.less";

const TicketAutoBuyerForm = ({
  isHidingDetails,
  isTicketAutoBuyerEnabled,
  isTicketAutoBuyerConfigDirty,
  getTicketBuyerConfigResponse,
  balanceToMaintain,
  maxFee,
  maxPriceAbsolute,
  maxPriceRelative,
  maxPerBlock,
  balanceToMaintainError,
  maxFeeError,
  maxPriceAbsoluteError,
  maxPriceRelativeError,
  maxPerBlockError,
  onChangeBalanceToMaintain,
  onChangeMaxFee,
  onChangeMaxPriceAbsolute,
  onChangeMaxPriceRelative,
  onChangeMaxPerBlock,
  onUpdateTicketAutoBuyerConfig,
  onToggleTicketAutoBuyer,
  onToggleShowDetails
}) => (
  <div>
    <div className="stakepool-voting-title-area">
      <div className="stakepool-voting-title-area-name">Automatic Purchase</div>
    </div>
    <div className={isHidingDetails ? "stakepool-flex-height-auto-buyer-hidden" : "stakepool-flex-height-auto-buyer-shown" }>
      <div className="stakepool-auto-buyer-row">
        <AutoBuyerSwitch enabled={isTicketAutoBuyerEnabled} onClick={onToggleTicketAutoBuyer} />
        <div className="stakepool-auto-buyer-label">{isTicketAutoBuyerEnabled ? "Enabled" : "Disabled"}</div>
        <div className="stakepool-auto-buyer-quick-bar-row">
          {isHidingDetails ? (
            <div>
              <div className="stakepool-auto-buyer-icon-areas" data-tip="Balance To Maintain"><div className="stakepool-balance-to-maintain-icon"/>{balanceToMaintain}</div>
              <div className="stakepool-auto-buyer-icon-areas" data-tip="Max Fee"><div className="stakepool-max-fee-icon"/>{maxFee} DCR</div>
              <div className="stakepool-auto-buyer-icon-areas" data-tip="Max Price Absolute"><div className="stakepool-max-price-absolute-icon"/>{maxPriceAbsolute} DCR</div>
              <div className="stakepool-auto-buyer-icon-areas" data-tip="Max Price Relative"><div className="stakepool-max-price-relative-icon"/>{maxPriceRelative}%</div>
              <div className="stakepool-auto-buyer-icon-areas" data-tip="Max Per Block"><div className="stakepool-max-per-block-icon"/>{maxPerBlock}</div>
            </div>
          ) : null}
        </div>
        <div className="stakepool-auto-buyer-show-advanced-area">
          <TicketsCogs opened={isHidingDetails} onClick={onToggleShowDetails} />
        </div>
      </div>
      <div hidden={isHidingDetails ? true : false}>
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-row-left">
            <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-balance-to-maintain-icon"/>Balance to maintain:</div>
            <div className="stakepool-purchase-ticket-num-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder="Balance to Maintain"
                  value={balanceToMaintain}
                  onChange={e => onChangeBalanceToMaintain(e.target.value)}
                />
              </div>
            </div>
            {balanceToMaintainError ? (
              <div className="stakepool-purchase-ticket-input-error">{balanceToMaintainError}</div>
            ) : null}
          </div>
          <div className="stakepool-purchase-ticket-row-right">
            <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-fee-icon"/>Max Fee:</div>
            <div className="stakepool-purchase-ticket-num-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder="Max Fee"
                  value={maxFee}
                  onChange={e => onChangeMaxFee(e.target.value)}
                />
              </div>
            </div>
            {maxFeeError ? (
              <div className="stakepool-purchase-ticket-input-error">{maxFeeError}</div>
            ) : null}
          </div>
        </div>
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-row-left">
            <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-price-absolute-icon"/>Max Price Absolute:</div>
            <div className="stakepool-purchase-ticket-num-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder="Max Price Absolute"
                  value={maxPriceAbsolute}
                  onChange={e => onChangeMaxPriceAbsolute(e.target.value)}
                />
              </div>
            </div>
            {maxPriceAbsoluteError ? (
              <div className="stakepool-purchase-ticket-input-error">{maxPriceAbsoluteError}</div>
            ) : null}
          </div>
          <div className="stakepool-purchase-ticket-row-right">
            <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-price-relative-icon"/>Max Price Relative:</div>
            <div className="stakepool-purchase-ticket-num-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder="Max Price Relative"
                  value={maxPriceRelative}
                  onChange={e => onChangeMaxPriceRelative(e.target.value)}
                />
              </div>
            </div>
            {maxPriceRelativeError ? (
              <div className="stakepool-purchase-ticket-input-error">{maxPriceRelativeError}</div>
            ) : null}
          </div>
        </div>
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-per-block-icon"/>Max Per Block:</div>
          <div className="stakepool-purchase-ticket-num-input">
            <div className="stakepool-input-form-purchase-ticket">
              <input
                type="text"
                className="stakepool-content-nest-purchase-ticket-form"
                placeholder="Max Per Block"
                value={maxPerBlock}
                onChange={e => onChangeMaxPerBlock(e.target.value)}
              />
            </div>
          </div>
          {maxPerBlockError ? (
            <div className="stakepool-purchase-ticket-input-error">{maxPerBlockError}</div>
          ) : null}
        </div>
        <div hidden={!getTicketBuyerConfigResponse}>
          <KeyBlueButton
            className="stakepool-content-purchase-button"
            disabled={!isTicketAutoBuyerConfigDirty}
            onClick={onUpdateTicketAutoBuyerConfig}
          >Update Config</KeyBlueButton>
        </div>
      </div>
    </div>
  </div>
);

export default TicketAutoBuyerForm;