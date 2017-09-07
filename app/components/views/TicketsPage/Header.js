import React from "react";
import Header from "../../Header";
import Balance from "../../Balance";
import TextToggle from "../../TextToggle";
import { StakePoolStyles } from "../ViewStyles";
import ticketsPage from "../../../connectors/ticketsPage";

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
        <div key="updateStakePoolError" style={StakePoolStyles.viewNotificationError}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearStakePoolConfigError}/>
          {currentStakePoolConfigError}
        </div>
      ) : null,
      currentStakePoolConfigSuccessMessage ? (
        <div key="configSuccess"  style={StakePoolStyles.viewNotificationSuccess}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearStakePoolConfigSuccess}/>
          {currentStakePoolConfigSuccessMessage}
        </div>
      ) : null,
      purchaseTicketsError ? (
        <div key="purchaseTicketsError" style={StakePoolStyles.viewNotificationError}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearPurchaseTicketsError}/>
          {purchaseTicketsError}
        </div>
      ) : null,
      purchaseTicketsSuccess ? (
        <div key="purchaseTicketsSuccess" style={StakePoolStyles.viewNotificationSuccess}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearPurchaseTicketsSuccess}/>
          {purchaseTicketsSuccess}
        </div>
      ) : null,
      revokeTicketsError ? (
        <div key="revokeTicketsError" style={StakePoolStyles.viewNotificationError}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearRevokeTicketsError}/>
          {revokeTicketsError}
        </div>
      ) : null,
      revokeTicketsSuccess ? (
        <div key="revokeTicketsSuccess" style={StakePoolStyles.viewNotificationSuccess}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearRevokeTicketsSuccess}/>
          {revokeTicketsSuccess}
        </div>
      ) : null,
      startAutoBuyerSuccess ? (
        <div key="startAutoBuyerSuccess" style={StakePoolStyles.viewNotificationSuccess}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearStartAutoBuyerSuccess}/>
          {startAutoBuyerSuccess}
        </div>
      ) : null,
      stopAutoBuyerSuccess ? (
        <div key="stopAutoBuyerSuccess" style={StakePoolStyles.viewNotificationSuccess}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearStopAutoBuyerSuccess}/>
          {stopAutoBuyerSuccess}
        </div>
      ) : null,
      startAutoBuyerError ? (
        <div key="startAutoBuyerError" style={StakePoolStyles.viewNotificationError}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearStartAutoBuyerError}/>
          {startAutoBuyerError}
        </div>
      ) : null,
      stopAutoBuyerError ? (
        <div key="stopAutoBuyerError" style={StakePoolStyles.viewNotificationError}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearStopAutoBuyerError}/>
          {stopAutoBuyerError}
        </div>
      ) : null,
      importScriptError ? (
        <div key="importScriptError" style={StakePoolStyles.viewNotificationError}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearImportScriptError}/>
          {importScriptError}
        </div>
      ) : null,
      importScriptSuccess ? (
        <div key="importScriptSuccess" style={StakePoolStyles.viewNotificationSuccess}>
          <div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={onClearImportScriptSuccess}/>
          {importScriptSuccess}
        </div>
      ) : null
    ]}
    headerTitleOverview={
      <div style={{height: "100%"}}>
        <div style={{float: "left"}}>
          {isShowingAddStakePool ? "Stake pool settings" : isShowingVotingPrefs ? "" : "Ticket price:"}
        </div>
      </div>
    }
    headerMetaOverview={
      isShowingAddStakePool ? null : (
        <div>
          <Balance amount={ticketPrice} />
          <div style={StakePoolStyles.toggle}>
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
