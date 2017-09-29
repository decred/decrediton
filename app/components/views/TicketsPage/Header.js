import React from "react";
import Header from "../../Header";
import Balance from "../../Balance";
import TextToggle from "../../TextToggle";
import "../../../style/StakePool.less";
import ticketsPage from "../../../connectors/ticketsPage";
import { FormattedMessage } from "react-intl";

const TicketsPageHeader = ({
  isShowingVotingPrefs,
  isShowingAddStakePool,
  ticketPrice,
  currentStakePoolConfigError,
  currentStakePoolConfigSuccessMessage,
  purchaseTicketsError,
  purchaseTicketsSuccess,
  revokeTicketsError,
  revokeTicketsSuccess,
  startAutoBuyerSuccess,
  stopAutoBuyerSuccess,
  startAutoBuyerError,
  stopAutoBuyerError,
  importScriptError,
  importScriptSuccess,
  onToggleTicketStakePool,
  onClearStakePoolConfigError,
  onClearStakePoolConfigSuccess,
  onClearPurchaseTicketsError,
  onClearPurchaseTicketsSuccess,
  onClearRevokeTicketsError,
  onClearRevokeTicketsSuccess,
  onClearStartAutoBuyerSuccess,
  onClearStopAutoBuyerSuccess,
  onClearStartAutoBuyerError,
  onClearStopAutoBuyerError,
  onClearImportScriptError,
  onClearImportScriptSuccess
}) => (
  <Header
    headerTop={[
      currentStakePoolConfigError ? (
        <div key="updateStakePoolError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStakePoolConfigError}/>
          {currentStakePoolConfigError}
        </div>
      ) : null,
      currentStakePoolConfigSuccessMessage ? (
        <div key="configSuccess"  className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStakePoolConfigSuccess}/>
          {currentStakePoolConfigSuccessMessage}
        </div>
      ) : null,
      purchaseTicketsError ? (
        <div key="purchaseTicketsError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearPurchaseTicketsError}/>
          {purchaseTicketsError}
        </div>
      ) : null,
      purchaseTicketsSuccess ? (
        <div key="purchaseTicketsSuccess" className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearPurchaseTicketsSuccess}/>
          {purchaseTicketsSuccess}
        </div>
      ) : null,
      revokeTicketsError ? (
        <div key="revokeTicketsError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearRevokeTicketsError}/>
          {revokeTicketsError}
        </div>
      ) : null,
      revokeTicketsSuccess ? (
        <div key="revokeTicketsSuccess" className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearRevokeTicketsSuccess}/>
          {revokeTicketsSuccess}
        </div>
      ) : null,
      startAutoBuyerSuccess ? (
        <div key="startAutoBuyerSuccess" className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStartAutoBuyerSuccess}/>
          {startAutoBuyerSuccess}
        </div>
      ) : null,
      stopAutoBuyerSuccess ? (
        <div key="stopAutoBuyerSuccess" className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStopAutoBuyerSuccess}/>
          {stopAutoBuyerSuccess}
        </div>
      ) : null,
      startAutoBuyerError ? (
        <div key="startAutoBuyerError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStartAutoBuyerError}/>
          {startAutoBuyerError}
        </div>
      ) : null,
      stopAutoBuyerError ? (
        <div key="stopAutoBuyerError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStopAutoBuyerError}/>
          {stopAutoBuyerError}
        </div>
      ) : null,
      importScriptError ? (
        <div key="importScriptError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearImportScriptError}/>
          {importScriptError}
        </div>
      ) : null,
      importScriptSuccess ? (
        <div key="importScriptSuccess" className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearImportScriptSuccess}/>
          {importScriptSuccess}
        </div>
      ) : null
    ]}
    headerTitleOverview={
      <div style={{height: "100%"}}>
        <div style={{float: "left"}}>
          {isShowingAddStakePool
            ? <FormattedMessage id="stake.titleSettings" defaultMessage="Stake pool settings" />
            : isShowingVotingPrefs ? "" : <FormattedMessage id="stake.titleTicketPrice" defaultMessage="Ticket price" />}:
        </div>
      </div>
    }
    headerMetaOverview={
      isShowingAddStakePool ? null : (
        <div>
          <Balance amount={ticketPrice} />
          <div className="stakepool-toggle">
            <TextToggle
              activeButton={"left"}
              leftText={"Purchase Tickets"}
              rightText={"Vote settings"}
              toggleAction={onToggleTicketStakePool}
            />
          </div>
        </div>
      )
    }
  />
);

export default ticketsPage(TicketsPageHeader);
