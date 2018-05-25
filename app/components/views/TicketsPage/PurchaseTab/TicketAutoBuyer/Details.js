import { FeeInput, FixedDcrInput, PercentInput, IntegerInput } from "inputs";
import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";

const Details = ({
  isTicketAutoBuyerConfigDirty,
  getTicketBuyerConfigResponse,
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
      <div className="stakepool-purchase-ticket-row-sides">
        <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-balance-to-maintain-icon">
          {<T id="autobuyer.balanceToMaintain" m="Balance to Maintain" />}:
        </div></div>
        <div className="stakepool-purchase-ticket-num-input">
          <div className="stakepool-input-form-purchase-ticket">
            <FixedDcrInput
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
      <div className="stakepool-purchase-ticket-row-sides">
        <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-fee-icon">
          {<T id="autobuyer.maxFee" m="Max Fee" />}:
        </div></div>
        <div className="stakepool-purchase-ticket-num-input">
          <div className="stakepool-input-form-purchase-ticket">
            <FeeInput
              value={maxFee}
              onChange={onChangeMaxFee}
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
      <div className="stakepool-purchase-ticket-row-sides">
        <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-price-absolute-icon">
          {<T id="autobuyer.maxPriceAbsolute" m="Max Price Absolute" />}:
        </div></div>
        <div className="stakepool-purchase-ticket-num-input">
          <div className="stakepool-input-form-purchase-ticket">
            <FixedDcrInput
              value={maxPriceAbsolute}
              onChange={onChangeMaxPriceAbsolute}
              invalid={maxPriceAbsoluteError}
              showErrors
              required
            />
          </div>
        </div>

      </div>
      <div className="stakepool-purchase-ticket-row-sides">
        <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-price-relative-icon">
          {<T id="autobuyer.maxPriceRelative" m="Max Price Relative" />}:
        </div></div>
        <div className="stakepool-purchase-ticket-num-input">
          <PercentInput
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
      <div className="stakepool-purchase-ticket-row-sides">
        <div className="stakepool-auto-buyer-icon-areas-expand"><div className="stakepool-max-per-block-icon">
          {<T id="autobuyer.maxPerBlock" m="Max Per Block" />}:
        </div></div>
        <div className="stakepool-purchase-ticket-num-input">
          <div className="stakepool-input-form-purchase-ticket">
            <IntegerInput
              value={maxPerBlock}
              onChange={onChangeMaxPerBlock}
              unit={<T id="autobuyer.maxPerBlock.units" m="tickets" />}
              showErrors
              required
            />
          </div>
        </div>
      </div>
    </div>
    <div className="stakepool-content-update-autobuyer-area">
      {!getTicketBuyerConfigResponse ? null :
        <KeyBlueButton
          className="stakepool-content-purchase-button"
          disabled={!isTicketAutoBuyerConfigDirty}
          onClick={onUpdateTicketAutoBuyerConfig}
        >
          <T id="autobuyer.updateConfigBtn" m="Update Config" />
        </KeyBlueButton>
      }
    </div>
  </div>
);

export default Details;
