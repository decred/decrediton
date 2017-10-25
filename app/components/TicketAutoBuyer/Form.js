import React from "react";
import TicketsCogs from "../TicketsCogs";
import AutoBuyerSwitch from "../AutoBuyerSwitch";
import KeyBlueButton from "../KeyBlueButton";
import PurchaseTicketsInfoButton from "../PurchaseTicketsInfoButton";
import NumericInput from "../NumericInput";
import DecredInput from "../DecredInput";
import { Tooltip } from "shared";
import { defineMessages, FormattedMessage as T } from "react-intl";
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
  maxFeeError,
  balanceToMaintainError,
  maxPriceAbsoluteError,
  maxPriceRelativeError,
  formatMessage,
  onChangeBalanceToMaintain,
  onChangeMaxFee,
  onChangeMaxPriceAbsolute,
  onChangeMaxPriceRelative,
  onChangeMaxPerBlock,
  onUpdateTicketAutoBuyerConfig,
  onToggleTicketAutoBuyer,
  onToggleShowDetails,
  onShowAutoBuyerTicketsInfo,
  canNotEnableAutobuyer
}) => (
  <div>
    <div className="stakepool-voting-title-area">
      <div className="stakepool-voting-title-area-name">
        <T id="autobuyer.title" m="Automatic Purchase" /></div>
    </div>
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
              <Tooltip text={<T id="autobuyer.balanceToMaintain" m="Balance to Maintain" /> }>
                <div className="stakepool-balance-to-maintain-icon">{balanceToMaintain}</div>
              </Tooltip>
              <Tooltip text={<T id="autobuyer.maxFee" m="Max Fee" /> }>
                <div className="stakepool-max-fee-icon">{maxFee} DCR</div>
              </Tooltip>
              <Tooltip text={<T id="autobuyer.maxPriceAbsolute" m="Max Price Absolute" /> }>
                <div className="stakepool-max-price-absolute-icon">{maxPriceAbsolute} DCR</div>
              </Tooltip>
              <Tooltip text={<T id="autobuyer.maxPriceRelative" m="Max Price Relative" /> }>
                <div className="stakepool-max-price-relative-icon">{maxPriceRelative}%</div>
              </Tooltip>
              <Tooltip text={<T id="autobuyer.maxPerBlock" m="Max Per Block" /> }>
                <div className="stakepool-max-per-block-icon">{maxPerBlock}</div>
              </Tooltip>
            </div>
          ) : null}
        </div>
        <div className="stakepool-purchase-ticket-input-buttons">
        <PurchaseTicketsInfoButton onClick={onShowAutoBuyerTicketsInfo} />
        <TicketsCogs opened={isHidingDetails} onClick={onToggleShowDetails} />
      </div>

      </div>
      <div className={isHidingDetails ? "stakepool-flex-height-auto-buyer-hidden" : "stakepool-flex-height-auto-buyer-shown"}>
        <div hidden={isHidingDetails ? true : false} className="stakepool-auto-buyer-advanced-area">
          {canNotEnableAutobuyer ?
            <div className="orange-warning">
              <T id="autobuyer.canNotEnableAutobuyer" m="*Please fix fields with errors" />
            </div> : null}
          <div className="stakepool-purchase-ticket-row">
            <div className="stakepool-purchase-ticket-row-left">
              <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-balance-to-maintain-icon">
                {<T id="autobuyer.balanceToMaintain" m="Balance to Maintain" />}:
            </div></div>
              <div className="stakepool-purchase-ticket-num-input">
                <div className="stakepool-input-form-purchase-ticket">
                  <DecredInput
                    placeholder={formatMessage(messages.balanceToMaintain)}
                    value={balanceToMaintain}
                    onChange={e => onChangeBalanceToMaintain(e.target.value)}
                    invalid={balanceToMaintainError}
                    invalidMessage={<T id="autobuyer.balanceToMaintainError"
                      m="Your balance to mantain is invalid" />}
                    showErrors
                    required
                  />
                </div>
              </div>
            </div>
            <div className="stakepool-purchase-ticket-row-right">
              <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-fee-icon">
                {<T id="autobuyer.maxFee" m="Max Fee" />}:
            </div></div>
              <div className="stakepool-purchase-ticket-num-input">
                <div className="stakepool-input-form-purchase-ticket">
                  <DecredInput
                    placeholder={formatMessage(messages.maxFee)}
                    value={maxFee}
                    onChange={e => onChangeMaxFee(e.target.value)}
                    invalid={maxFeeError}
                    invalidMessage={<T id="autobuyer.invalidMaxFee" m="*Invalid max fee (0 - 0.1 DCR/KB)" />}
                    showErrors
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="stakepool-purchase-ticket-row">
            <div className="stakepool-purchase-ticket-row-left">
              <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-price-absolute-icon">
                {<T id="autobuyer.maxPriceAbsolute" m="Max Price Absolute" />}:
            </div></div>
              <div className="stakepool-purchase-ticket-num-input">
                <div className="stakepool-input-form-purchase-ticket">
                  <DecredInput
                    placeholder={formatMessage(messages.maxPriceAbsolute)}
                    value={maxPriceAbsolute}
                    onChange={e => onChangeMaxPriceAbsolute(e.target.value)}
                    invalid={maxPriceAbsoluteError}
                    showErrors
                    required
                  />
                </div>
              </div>

            </div>
            <div className="stakepool-purchase-ticket-row-right">
              <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-price-relative-icon">
                {<T id="autobuyer.maxPriceRelative" m="Max Price Relative" />}:
            </div></div>
              <div className="stakepool-purchase-ticket-num-input">
                <NumericInput
                  placeholder={formatMessage(messages.maxPriceRelative)}
                  value={maxPriceRelative}
                  onChange={e => onChangeMaxPriceRelative(e.target.value)}
                  unit="%"
                  invalid={maxPriceRelativeError}
                  showErrors
                  required
                />
              </div>

            </div>
          </div>
          <div className="stakepool-purchase-ticket-row">
            <div className="stakepool-purchase-ticket-row-left">
              <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-per-block-icon">
                {<T id="autobuyer.maxPerBlock" m="Max Per Block" />}:
            </div></div>
              <div className="stakepool-purchase-ticket-num-input">
                <div className="stakepool-input-form-purchase-ticket">
                  <NumericInput
                    placeholder={formatMessage(messages.maxPerBlock)}
                    value={maxPerBlock}
                    onChange={e => onChangeMaxPerBlock(e.target.value)}
                    showErrors
                    required
                  />
                </div>
              </div>
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
    </div>
  );

export default TicketAutoBuyerForm;
