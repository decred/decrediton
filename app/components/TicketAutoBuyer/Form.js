import React from "react";
import TicketsCogs from "../TicketsCogs";
import AutoBuyerSwitch from "../AutoBuyerSwitch";
import KeyBlueButton from "../KeyBlueButton";
import { StakePoolStyles } from "../views/ViewStyles";

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
    <div style={StakePoolStyles.votingTitleArea}>
      <div style={StakePoolStyles.votingTitleAreaName}>Automatic Purchase</div>
    </div>
    <div style={isHidingDetails ? StakePoolStyles.flexHeightAutoBuyerHidden : StakePoolStyles.flexHeightAutoBuyerShown }>
      <div style={StakePoolStyles.autoBuyerRow}>
        <AutoBuyerSwitch enabled={isTicketAutoBuyerEnabled} onClick={onToggleTicketAutoBuyer} />
        <div style={StakePoolStyles.autoBuyerLabel}>{isTicketAutoBuyerEnabled ? "Enabled" : "Disabled"}</div>
        <div style={StakePoolStyles.autoBuyerQuickBarRow}>
          {isHidingDetails ? (
            <div>
              <div style={StakePoolStyles.autoBuyerIconAreas} data-tip="Balance To Maintain"><div style={StakePoolStyles.balanceToMaintainIcon}/>{balanceToMaintain}</div>
              <div style={StakePoolStyles.autoBuyerIconAreas} data-tip="Max Fee"><div style={StakePoolStyles.maxFeeIcon}/>{maxFee} DCR</div>
              <div style={StakePoolStyles.autoBuyerIconAreas} data-tip="Max Price Absolute"><div style={StakePoolStyles.maxPriceAbsoluteIcon}/>{maxPriceAbsolute} DCR</div>
              <div style={StakePoolStyles.autoBuyerIconAreas} data-tip="Max Price Relative"><div style={StakePoolStyles.maxPriceRelativeIcon}/>{maxPriceRelative}%</div>
              <div style={StakePoolStyles.autoBuyerIconAreas} data-tip="Max Per Block"><div style={StakePoolStyles.maxPerBlockIcon}/>{maxPerBlock}</div>
            </div>
          ) : null}
        </div>
        <div style={StakePoolStyles.autoBuyerShowAdvancedArea}>
          <TicketsCogs opened={isHidingDetails} onClick={onToggleShowDetails} />
        </div>
      </div>
      <div hidden={isHidingDetails ? true : false}>
        <div style={StakePoolStyles.purchaseTicketRow}>
          <div style={StakePoolStyles.purchaseTicketRowLeft}>
            <div style={StakePoolStyles.autoBuyerIconAreasExpand}><div style={StakePoolStyles.balanceToMaintainIcon}/>Balance to maintain:</div>
            <div style={StakePoolStyles.purchaseTicketNumInput}>
              <div style={StakePoolStyles.inputFormPurchaseTicket}>
                <input
                  type="text"
                  style={StakePoolStyles.contentNestPurchaseTicketForm}
                  placeholder="Balance to Maintain"
                  value={balanceToMaintain}
                  onChange={e => onChangeBalanceToMaintain(e.target.value)}
                />
              </div>
            </div>
            {balanceToMaintainError ? (
              <div style={StakePoolStyles.purchaseTicketInputError}>{balanceToMaintainError}</div>
            ) : null}
          </div>
          <div style={StakePoolStyles.purchaseTicketRowRight}>
            <div style={StakePoolStyles.autoBuyerIconAreasExpand}><div style={StakePoolStyles.maxFeeIcon}/>Max Fee:</div>
            <div style={StakePoolStyles.purchaseTicketNumInput}>
              <div style={StakePoolStyles.inputFormPurchaseTicket}>
                <input
                  type="text"
                  style={StakePoolStyles.contentNestPurchaseTicketForm}
                  placeholder="Max Fee"
                  value={maxFee}
                  onChange={e => onChangeMaxFee(e.target.value)}
                />
              </div>
            </div>
            {maxFeeError ? (
              <div style={StakePoolStyles.purchaseTicketInputError}>{maxFeeError}</div>
            ) : null}
          </div>
        </div>
        <div style={StakePoolStyles.purchaseTicketRow}>
          <div style={StakePoolStyles.purchaseTicketRowLeft}>
            <div style={StakePoolStyles.autoBuyerIconAreasExpand}><div style={StakePoolStyles.maxPriceAbsoluteIcon}/>Max Price Absolute:</div>
            <div style={StakePoolStyles.purchaseTicketNumInput}>
              <div style={StakePoolStyles.inputFormPurchaseTicket}>
                <input
                  type="text"
                  style={StakePoolStyles.contentNestPurchaseTicketForm}
                  placeholder="Max Price Absolute"
                  value={maxPriceAbsolute}
                  onChange={e => onChangeMaxPriceAbsolute(e.target.value)}
                />
              </div>
            </div>
            {maxPriceAbsoluteError ? (
              <div style={StakePoolStyles.purchaseTicketInputError}>{maxPriceAbsoluteError}</div>
            ) : null}
          </div>
          <div style={StakePoolStyles.purchaseTicketRowRight}>
            <div style={StakePoolStyles.autoBuyerIconAreasExpand}><div style={StakePoolStyles.maxPriceRelativeIcon}/>Max Price Relative:</div>
            <div style={StakePoolStyles.purchaseTicketNumInput}>
              <div style={StakePoolStyles.inputFormPurchaseTicket}>
                <input
                  type="text"
                  style={StakePoolStyles.contentNestPurchaseTicketForm}
                  placeholder="Max Price Relative"
                  value={maxPriceRelative}
                  onChange={e => onChangeMaxPriceRelative(e.target.value)}
                />
              </div>
            </div>
            {maxPriceRelativeError ? (
              <div style={StakePoolStyles.purchaseTicketInputError}>{maxPriceRelativeError}</div>
            ) : null}
          </div>
        </div>
        <div style={StakePoolStyles.purchaseTicketRow}>
          <div style={StakePoolStyles.autoBuyerIconAreasExpand}><div style={StakePoolStyles.maxPerBlockIcon}/>Max Per Block:</div>
          <div style={StakePoolStyles.purchaseTicketNumInput}>
            <div style={StakePoolStyles.inputFormPurchaseTicket}>
              <input
                type="text"
                style={StakePoolStyles.contentNestPurchaseTicketForm}
                placeholder="Max Per Block"
                value={maxPerBlock}
                onChange={e => onChangeMaxPerBlock(e.target.value)}
              />
            </div>
          </div>
          {maxPerBlockError ? (
            <div style={StakePoolStyles.purchaseTicketInputError}>{maxPerBlockError}</div>
          ) : null}
        </div>
        <div hidden={!getTicketBuyerConfigResponse}>
          <KeyBlueButton
            style={StakePoolStyles.contentPurchaseButton}
            disabled={!isTicketAutoBuyerConfigDirty}
            onClick={onUpdateTicketAutoBuyerConfig}
          >Update Config</KeyBlueButton>
        </div>
      </div>
    </div>
  </div>
);

export default TicketAutoBuyerForm;
