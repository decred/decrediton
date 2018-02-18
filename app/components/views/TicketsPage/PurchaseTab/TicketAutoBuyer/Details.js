import { FeeInput, FixedDcrInput, PercentInput, BlocksInput } from "inputs";
import { KeyBlueButton } from "buttons";
import { FormattedMessage as T, defineMessages } from "react-intl";

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

const Details = ({
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
  balanceToMaintain,
  maxFee,
  maxPriceAbsolute,
  maxPriceRelative,
  maxPerBlock
}) => (
  <div className="stakepool-auto-buyer-advanced-area">
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
            <FixedDcrInput
              placeholder={formatMessage(messages.balanceToMaintain)}
              value={balanceToMaintain}
              onChange={onChangeBalanceToMaintain}
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
            <FeeInput
              placeholder={formatMessage(messages.maxFee)}
              value={maxFee}
              onChange={onChangeMaxFee}
              invalid={maxFeeError}
              invalidMessage={<T id="autobuyer.invalidMaxFee" m="*Invalid max fee (0 - 0.1 Hx/KB)" />}
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
            <FixedDcrInput
              placeholder={formatMessage(messages.maxPriceAbsolute)}
              value={maxPriceAbsolute}
              onChange={onChangeMaxPriceAbsolute}
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
          <PercentInput
            placeholder={formatMessage(messages.maxPriceRelative)}
            value={maxPriceRelative}
            onChange={onChangeMaxPriceRelative}
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
            <BlocksInput
              placeholder={formatMessage(messages.maxPerBlock)}
              value={maxPerBlock}
              onChange={onChangeMaxPerBlock}
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
);

export default Details;
