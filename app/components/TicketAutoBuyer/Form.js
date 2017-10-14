import React from "react";
import { Icon, Heading } from "shared";
import AutoBuyerSwitch from "../AutoBuyerSwitch";
import KeyBlueButton from "../KeyBlueButton";
import {defineMessages, FormattedMessage as T} from "react-intl";
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
    <Heading py="1em" f={ 20 }><T id="autobuyer.title" m="Automatic Purchase" /></Heading>
    <div className={isHidingDetails ? "stakepool-flex-height-auto-buyer-hidden" : "stakepool-flex-height-auto-buyer-shown" }>
      <div className="stakepool-auto-buyer-row">
        <AutoBuyerSwitch enabled={isTicketAutoBuyerEnabled} onClick={onToggleTicketAutoBuyer} />
        <div className="stakepool-auto-buyer-label">
          {isTicketAutoBuyerEnabled
            ? <T id="autobuyer.enabled" m="Enabled" />
            : <T id="autobuyer.disabled" m="Disabled" />}
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
          <Icon i="cog" active={!isHidingDetails} onClick={onToggleShowDetails} />
        </div>
      </div>
      <div hidden={isHidingDetails ? true : false} className="stakepool-auto-buyer-advanced-area">
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-row-left">
            <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-balance-to-maintain-icon">
              {<T id="autobuyer.balanceToMaintain" m="Balance to Maintain" />}:
            </div></div>
            <div className="stakepool-purchase-ticket-num-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder={formatMessage(messages.balanceToMaintain)}
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
              {<T id="autobuyer.maxFee" m="Max Fee" />}:
            </div></div>
            <div className="stakepool-purchase-ticket-num-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder={formatMessage(messages.maxFee)}
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
              {<T id="autobuyer.maxPriceAbsolute" m="Max Price Absolute" />}:
            </div></div>
            <div className="stakepool-purchase-ticket-num-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder={formatMessage(messages.maxPriceAbsolute)}
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
              {<T id="autobuyer.maxPriceRelative" m="Max Price Relative" />}:
            </div></div>
            <div className="stakepool-purchase-ticket-num-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder={formatMessage(messages.maxPriceRelative)}
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
              {<T id="autobuyer.maxPerBlock" m="Max Per Block" />}:
            </div></div>
            <div className="stakepool-purchase-ticket-num-input">
              <div className="stakepool-input-form-purchase-ticket">
                <input
                  type="text"
                  className="stakepool-content-nest-purchase-ticket-form"
                  placeholder={formatMessage(messages.maxPerBlock)}
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
          <T id="autobuyer.updateConfigBtn" m="Update Config" />
          </KeyBlueButton>
        </div>
      </div>
    </div>
  </div>
);

export default TicketAutoBuyerForm;
