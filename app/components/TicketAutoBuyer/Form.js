import React from "react";
import TicketsCogs from "../TicketsCogs";
import AutoBuyerSwitch from "../AutoBuyerSwitch";
import KeyBlueButton from "../KeyBlueButton";
import {defineMessages, FormattedMessage} from "react-intl";
import "../../style/StakePool.less";

const messages = defineMessages({
  balanceToMaintain: {
    id: "autobuyer.balanceToMaintain",
    defaultMessage: "Balance to Maintain",
  },
  maxFee: {
    id: "autobuyer.maxFee",
    defaultMessage: "Max Fee",
  },
  maxPriceAbsolute: {
    id: "autobuyer.maxPriceAbsolute",
    defaultMessage: "Max Price Absolute",
  },
  maxPriceRelative: {
    id: "autobuyer.maxPriceRelative",
    defaultMessage: "Max Price Relative",
  },
  maxPerBlock: {
    id: "autobuyer.maxPerBlock",
    defaultMessage: "Max Per Block",
  },
});

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
  formatMessage,
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
      <div className="stakepool-voting-title-area-name">
        <FormattedMessage id="autobuyer.title" defaultMessage="Automatic Purchase" /></div>
    </div>
    <div className={isHidingDetails ? "stakepool-flex-height-auto-buyer-hidden" : "stakepool-flex-height-auto-buyer-shown" }>
      <div className="stakepool-auto-buyer-row">
        <AutoBuyerSwitch enabled={isTicketAutoBuyerEnabled} onClick={onToggleTicketAutoBuyer} />
        <div className="stakepool-auto-buyer-label">
          {isTicketAutoBuyerEnabled
            ? <FormattedMessage id="autobuyer.enabled" defaultMessage="Enabled" />
            : <FormattedMessage id="autobuyer.disabled" defaultMessage="Disabled" />}
        </div>
        <div className="stakepool-auto-buyer-quick-bar-row">
          {isHidingDetails ? (
            <div>
              <div data-tip={formatMessage(messages.balanceToMaintain)} className="stakepool-balance-to-maintain-icon" data-html={true}>{balanceToMaintain}</div>
              <div data-tip={formatMessage(messages.maxFee)} className="stakepool-max-fee-icon">{maxFee} DCR</div>
              <div data-tip={formatMessage(messages.maxPriceAbsolute)} className="stakepool-max-price-absolute-icon">{maxPriceAbsolute} DCR</div>
              <div data-tip={formatMessage(messages.maxPriceRelative)} className="stakepool-max-price-relative-icon">{maxPriceRelative}%</div>
              <div data-tip={formatMessage(messages.maxPerBlock)} className="stakepool-max-per-block-icon">{maxPerBlock}</div>
            </div>
          ) : null}
        </div>
        <div className="stakepool-auto-buyer-show-advanced-area">
          <TicketsCogs opened={isHidingDetails} onClick={onToggleShowDetails} />
        </div>
      </div>
      <div hidden={isHidingDetails ? true : false} className="stakepool-auto-buyer-advanced-area">
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-row-left">
            <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-balance-to-maintain-icon">
              {<FormattedMessage id="autobuyer.balanceToMaintain" defaultMessage="Balance to Maintain" />}:
            </div></div>
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
            <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-fee-icon">
              {<FormattedMessage id="autobuyer.maxFee" defaultMessage="Max Fee" />}:
            </div></div>
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
            <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-price-absolute-icon">
              {<FormattedMessage id="autobuyer.maxPriceAbsolute" defaultMessage="Max Price Absolute" />}:
            </div></div>
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
            <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-price-relative-icon">
              {<FormattedMessage id="autobuyer.maxPriceRelative" defaultMessage="Max Price Relative" />}:
            </div></div>
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
          <div className="stakepool-purchase-ticket-row-left">
            <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-per-block-icon">
              {<FormattedMessage id="autobuyer.maxPerBlock" defaultMessage="Max Per Block" />}:
            </div></div>
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
        </div>
        <div hidden={!getTicketBuyerConfigResponse}>
          <KeyBlueButton
            className="stakepool-content-purchase-button"
            disabled={!isTicketAutoBuyerConfigDirty}
            onClick={onUpdateTicketAutoBuyerConfig}
          >
          <FormattedMessage id="autobuyer.updateConfigBtn" defaultMessage="Update Config" />
          </KeyBlueButton>
        </div>
      </div>
    </div>
  </div>
);

export default TicketAutoBuyerForm;
