// @flow
import React, { Component } from "react";
import { shell } from "electron";
import { PropTypes } from "prop-types";
import StakeyBounce from "../StakeyBounce";
import ErrorScreen from "../ErrorScreen";
import Balance from "../Balance";
import SideBar from "../SideBar";
import Header from "../Header";
import TextToggle from "../TextToggle";
import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";
import { StakePoolStyles } from "./ViewStyles";
import AgendaCard from "../AgendaCard";
import AgendaOverview from "../AgendaOverview";
import PurchaseTicketsInfo from "../PurchaseTicketsInfo";
import PurchaseTicketsInfoButton from "../PurchaseTicketsInfoButton";
import TicketsCogs from "../TicketsCogs";
import NumTicketsInput from "../NumTicketsInput";
import ManagePoolsButton from "../ManagePoolsButton";
import AutoBuyerSwitch from "../AutoBuyerSwitch";
import PassphraseModal from "../PassphraseModal";
import ImportScriptModal from "../ImportScriptModal";
import Select from "react-select";
import ReactToolTip from "react-tooltip";
import { addSpacingAroundText } from "../../helpers/strings";
import "../../style/MiscComponents.less";
import { Link } from "react-router";

class StakePool extends Component{
  static propTypes = {
    walletService: PropTypes.object,
    ticketBuyerService: PropTypes.object,
  };
  constructor(props) {
    super(props);
    var selectedConfigured = undefined;
    var selectedUnconfigured = undefined;
    var configuredStakePools = Array();
    var unconfiguredStakePools = Array();
    // Look for any available uninitialized stakepool config
    // This will be set for the first in the dropdown for
    // setting apikey/purchase information of the stakepool.
    if (this.props.currentStakePoolConfig != null) {
      for (var i = 0; i < this.props.currentStakePoolConfig.length; i++) {
        if (!this.props.currentStakePoolConfig[i].ApiKey && this.props.currentStakePoolConfig[i].Network == this.props.network) {
          selectedUnconfigured = {value: this.props.currentStakePoolConfig[i], label: this.props.currentStakePoolConfig[i].Host};
          unconfiguredStakePools.push(selectedUnconfigured);
        }else if (this.props.currentStakePoolConfig[i].ApiKey && this.props.currentStakePoolConfig[i].Network == this.props.network) {
          selectedConfigured = {value: this.props.currentStakePoolConfig[i], label: this.props.currentStakePoolConfig[i].Host};
          configuredStakePools.push(selectedConfigured);
        }
      }
    }
    var defaultSpendLimit = 0;
    var accountsList = Array();
    var unitDivisor = 1;
    if (this.props.currentSettings.currencyDisplay == "DCR") {
      unitDivisor = 100000000;
    }
    if (this.props.balances != null) {
      for (i = 0; i < this.props.balances.length; i++) {
        if (this.props.balances[i].accountNumber == 0) {
          defaultSpendLimit = this.props.balances[i].spendable;
        }
        if (this.props.balances[i].accountNumber == 0 || this.props.balances[i].accountName != "imported" && this.props.balances[i].spendable > 0) {
          accountsList.push({ value: this.props.balances[i].accountNumber, label: this.props.balances[i].accountName + ": " +this.props.balances[i].spendable / unitDivisor + " " + this.props.currentSettings.currencyDisplay});
        }
      }
    }

    this.state = {
      accountsList: accountsList,
      configuredStakePools: configuredStakePools,
      selectedConfigured: selectedConfigured,
      unconfiguredStakePools: unconfiguredStakePools,
      selectedUnconfigured: selectedUnconfigured,
      apiKey: "",
      account: accountsList[0],
      addAnotherStakePool: false,
      purchaseTickets: true,
      purchaseTicketsStakePoolConfig: false,
      showPurchaseInfoModal: false,
      passphraseModalOpen: false,
      spendLimit: defaultSpendLimit,
      conf: 0,
      numTickets: 1,
      expiry: 16,
      txFee: 0.001, // DCR/kB
      ticketFee: 0.001, // DCR/kB
      advancedHidden: true,
      autoBuyerHidden: true,
      stakeInfoHidden: true,
      choice: "option1",

      // for autostart
      balanceToMaintain: this.props.balanceToMaintain, // in atoms
      maxFee: this.props.maxFee, // in atoms
      maxPriceRelative: this.props.maxPriceRelative, // percent
      maxPriceAbsolute: this.props.maxPriceAbsolute, // in atoms
      maxPerBlock: this.props.maxPerBlock,
      balanceToMaintainError: null,
      maxFeeError: null,
      maxPriceRelativeError: null,
      maxPriceAbsoluteError: null,
      maxPerBlockError: null,
      autoBuyerConfigChanged: false,

      // ImportScriptModal
      modalScriptHeading: null,
      modalScriptDescription: null,
      modalScriptSubmitFunc: null,
      importScriptModalOpen: false,

      // error form divs
      numTicketsError: null,
      txFeeError: null,
      ticketFeeError: null,
      expiryError: null,
      privPassError: null,
      apiKeyError: null,
      agendaDisplay: null,
    };
  }
  componentDidUpdate() {
    ReactToolTip.rebuild();
  }
  componentWillReceiveProps(nextProps) {
    var accountsList = Array();
    var unitDivisor = 1;
    if (nextProps.currentSettings.currencyDisplay == "DCR") {
      unitDivisor = 100000000;
    }
    if (this.props.balances != nextProps.balances) {
      var newAccountSpendableBalance = 0;
      for (var i = 0; i < nextProps.balances; i++) {
        if (nextProps.balances[i].accountNumber == this.state.account) {
          newAccountSpendableBalance = nextProps.balances[i].spendable;
        }
        if (nextProps.balances[i].accountNumber == 0 || nextProps.balances[i].accountName != "imported" && nextProps.balances[i].spendable > 0) {
          accountsList.push({ value: nextProps.balances[i].accountNumber, label: nextProps.balances[i].accountName + ": " + nextProps.balances[i].spendable / unitDivisor + " " + nextProps.currentSettings.currencyDisplay});
        }
      }
      this.setState({spendLimit: newAccountSpendableBalance, accountsList: accountsList });
    }
    if (this.props.currentStakePoolConfig != nextProps.currentStakePoolConfig) {
      var configuredStakePools = Array();
      var selectedConfigured = undefined;
      for (var j = 0; j < nextProps.currentStakePoolConfig.length; j++) {
        if (nextProps.currentStakePoolConfig[j].ApiKey && nextProps.currentStakePoolConfig[j].Network == this.props.network) {
          selectedConfigured = {value: nextProps.currentStakePoolConfig[j], label: nextProps.currentStakePoolConfig[j].Host};
          configuredStakePools.push(selectedConfigured);
        }
      }
      this.setState({selectedConfigured: selectedConfigured, configuredStakePools: configuredStakePools});
    }
    if (this.props.getVoteChoicesResponse !== nextProps.getVoteChoicesResponse) {
      for (i = 0; i < nextProps.getVoteChoicesResponse.getChoicesList().length; i++) {
        if (nextProps.getVoteChoicesResponse.getChoicesList()[i].getAgendaId() == this.state.agendaDisplay.getId()) {
          this.setState({selectedChoice: nextProps.getVoteChoicesResponse.getChoicesList()[i].getChoiceId()});
          break;
        }
      }
    }
    if (this.props.balanceToMaintain !== nextProps.balanceToMaintain ||
      this.props.maxFee !== nextProps.maxFee ||
      this.props.maxPriceAbsolute !== nextProps.maxPriceAbsolute ||
      this.props.maxPriceRelative !== nextProps.maxPriceRelative ||
      this.props.maxPerBlock !== nextProps.maxPerBlock
      ) {
      this.setState({balanceToMaintain: nextProps.balanceToMaintain, maxFee: nextProps.maxFee,
        maxPriceAbsolute: nextProps.maxPriceAbsolute, maxPriceRelative: nextProps.maxPriceRelative,
        maxPerBlock: nextProps.maxPerBlock, autoBuyerConfigChanged: false});
    }
    if (this.props.getTicketBuyerConfigResponse == null && this.props.getTicketBuyerConfigResponse !== nextProps.getTicketBuyerConfigResponse) {
      this.setState({autoBuyerConfigChanged: false});
    }
  }

  componentWillMount() {
    this.props.clearStakePoolConfigError();
    this.props.clearStakePoolConfigSuccess();
    this.props.clearPurchaseTicketsSuccess();
    this.props.clearPurchaseTicketsError();
    this.props.clearRevokeTicketsSuccess();
    this.props.clearRevokeTicketsError();
    this.props.clearImportScriptSuccess();
    this.props.clearImportScriptError();
    this.props.clearStartAutoBuyerSuccess();
    this.props.clearStartAutoBuyerError();
    this.props.clearStopAutoBuyerSuccess();
    this.props.clearStopAutoBuyerError();
  }
  importScript(privpass, script) {
    this.props.importScriptAttempt(privpass, script, true, 0, null);
    this.setState({importScriptModalOpen: false});
  }
  submitPurchase(privpass) {
    var checkErrors = false;
    if (this.state.selectedConfigured == null ||
       this.state.numTicketsError !== null || this.state.txFeeError !== null ||
       this.state.ticketFeeError !== null || this.state.expiryError !== null ||
       this.state.privPassError !== null) {
      checkErrors = true;
    }
    if (this.state.numTickets == 0) {
      this.setState({numTicketsError: "*You must purchase 1 or more tickets."});
      checkErrors = true;
    }
    if (checkErrors) {
      return;
    }
    this.props.purchaseTicketsAttempt(
      privpass,
      this.state.account.value,
      this.state.spendLimit,
      this.state.conf,
      this.state.numTickets,
      this.state.expiry,
      this.state.ticketFee,
      this.state.txFee,
      this.state.selectedConfigured.value,
    );
    this.setState({passphraseModalOpen: false});
  }
  submitRevoke(privpass) {
    var checkErrors = false;
    if (this.state.privPassError !== null) {
      checkErrors = true;
    }
    if (checkErrors) {
      return;
    }
    this.props.revokeTicketsAttempt(privpass);
    this.setState({passphraseModalOpen: false});
  }
  updateBalanceToMaintain(value) {
    if (!isNaN(value) && value < 0) {
      var err = "*Please enter a valid max fee (> 0)";
      this.setState({balanceToMaintainError: err});
    } else {
      var changed = value !== this.props.balanceToMaintain ||
       this.state.maxFee !== this.props.maxFee ||
       this.state.maxPriceAbsolute !== this.props.maxPriceAbsolute ||
       this.state.maxPriceRelative !== this.props.maxPriceRelative ||
       this.state.maxPerBlock !== this.props.maxPerBlock;
      this.setState({balanceToMaintain: value, autoBuyerConfigChanged: changed, balanceToMaintainError: null});
    }
  }
  updateMaxFee(value) {
    if (!isNaN(value) && value < 0) {
      var err = "*Please enter a valid max fee (> 0)";
      this.setState({maxFeeError: err});
    } else {
      var changed = this.state.balanceToMaintain !== this.props.balanceToMaintain ||
       value !== this.props.maxFee ||
       this.state.maxPriceAbsolute !== this.props.maxPriceAbsolute ||
       this.state.maxPriceRelative !== this.props.maxPriceRelative ||
       this.state.maxPerBlock !== this.props.maxPerBlock;
      this.setState({maxFee: value, autoBuyerConfigChanged: changed, maxFeeError: null});
    }
  }
  updateMaxPriceAbsolute(value) {
    if (!isNaN(value) && value < 0) {
      var err = "*Please enter a value max price absolute (> 0)";
      this.setState({maxPriceAbsoluteError: err});
    } else {
      var changed = this.state.balanceToMaintain !== this.props.balanceToMaintain ||
       this.state.maxFee !== this.props.maxFee ||
       value !== this.props.maxPriceAbsolute ||
       this.state.maxPriceRelative !== this.props.maxPriceRelative ||
       this.state.maxPerBlock !== this.props.maxPerBlock;
      this.setState({maxPriceAbsolute: value, autoBuyerConfigChanged: changed, maxPriceAbsoluteError: null});
    }
  }
  updateMaxPriceRelative(value) {
    if (!isNaN(value) && value < 0) {
      var err = "*Please enter a value max price relative (> 0)";
      this.setState({maxPriceRelativeError: err});
    } else {
      var changed = this.state.balanceToMaintain !== this.props.balanceToMaintain ||
       this.state.maxFee !== this.props.maxFee ||
       this.state.maxPriceAbsolute !== this.props.maxPriceAbsolute ||
       value !== this.props.maxPriceRelative ||
       this.state.maxPerBlock !== this.props.maxPerBlock;
      this.setState({maxPriceRelative: value, autoBuyerConfigChanged: changed, maxPriceRelativeError: null});
    }
  }
  updateMaxPerBlock(value) {
    if (!isNaN(value) && value < 0) {
      var err = "*Please enter a value max per block (> 0)";
      this.setState({maxPerBlockError: err});
    } else {
      var changed = this.state.balanceToMaintain !== this.props.balanceToMaintain ||
       this.state.maxFee !== this.props.maxFee ||
       this.state.maxPriceAbsolute !== this.props.maxPriceAbsolute ||
       this.state.maxPriceRelative !== this.props.maxPriceRelative ||
       value !== this.props.maxPerBlock;
      this.setState({maxPerBlock: value, autoBuyerConfigChanged: changed, maxPerBlockError: null});
    }
  }
  updateAutoBuyerSettings() {
    this.props.setTicketBuyerConfigAttempt(
      this.state.account.value,
      this.state.balanceToMaintain,
      this.state.maxFee,
      this.state.maxPriceAbsolute,
      this.state.maxPriceRelative,
      this.state.selectedConfigured.value,
      this.state.maxPerBlock
    );
  }
  showStakePoolConfig() {
    this.setState({purchaseTicketsStakePoolConfig: true});
  }
  hideStakePoolConfig() {
    this.setState({purchaseTicketsStakePoolConfig: false});
  }
  showStakeInfo() {
    this.setState({stakeInfoHidden: false});
  }
  hideStakeInfo() {
    this.setState({stakeInfoHidden: true});
  }
  updateAccountNumber(account) {
    this.setState({account: account});
    if (this.props.balances !== null) {
      var updatedAccountSpendLimit = 0;
      for (var i = 0; i < this.props.balances.length; i++) {
        if (this.props.balances[i].accountNumber == account.value) {
          updatedAccountSpendLimit = this.props.balances[i].spendable;
          break;
        }
      }
      this.setState({spendLimit: updatedAccountSpendLimit});
    }
  }
  incrementNumTickets() {
    this.setState({numTickets: this.state.numTickets + 1, numTicketsError: null});
  }
  decrementNumTickets() {
    if (this.state.numTickets > 1) {
      this.setState({numTickets: this.state.numTickets - 1});
    }
  }
  updateTicketFee(ticketFee) {
    if (!isNaN(ticketFee) && ticketFee > 0 && ticketFee < 1) {
      this.setState({ticketFee: ticketFee, ticketFeeError: null});
    } else {
      this.setState({ticketFeeError: "*Invalid ticket fee (0 - 1 DCR/KB)"});
    }
  }
  updateTxFee(txFee) {
    if (!isNaN(txFee) && txFee > 0 && txFee < 1) {
      this.setState({txFee: txFee, txFeeError: null});
    } else {
      this.setState({txFeeError: "*Invalid tx fee (0 - 1 DCR/KB)"});
    }
  }
  updateExpiry(expiry) {
    if (!isNaN(expiry) && expiry >= 0) {
      this.setState({expiry: expiry, expiryError: null});
    } else {
      this.setState({expiryError: "*Invalid expiry (>= 0)"});
    }
  }
  addAnotherStakePool() {
    this.setState({addAnotherStakePool: true});
  }
  cancelAddAnotherStakePool() {
    this.setState({addAnotherStakePool: false});
  }
  setStakePoolInfo(privpass) {
    if (this.state.apiKey == "") {
      this.setState({apiKeyError: "*Please enter your API key"});
      return;
    }
    if (this.state.selectedUnconfigured == null || this.state.apiKeyError !== null) {
      return;
    }
    this.props.setStakePoolInformation(privpass, this.state.selectedUnconfigured.label, this.state.apiKey, 0);
    setTimeout(this.setState({passphraseModalOpen: false, addAnotherStakePool: false}), 1000);
  }
  updateApiKey(apiKey) {
    if (apiKey != "") {
      this.setState({apiKey: apiKey, apiKeyError: null});
    } else {
      this.setState({apiKeyError: "*Please enter your API key"});
    }
  }
  toggleTicketStakePool(side) {
    if (side == "right") {
      this.setState({purchaseTickets: false, purchaseTicketsStakePoolConfig: false});
    } else if (side == "left") {
      this.setState({purchaseTickets: true, purchaseTicketsStakePoolConfig: false});
    }
  }
  showAdvanced() {
    this.setState({advancedHidden: false});
  }
  hideAdvanced() {
    this.setState({advancedHidden: true});
  }
  showAutoBuyer() {
    this.setState({autoBuyerHidden: false});
  }
  hideAutoBuyer() {
    this.setState({autoBuyerHidden: true});
  }
  submitStart(privpass) {
    this.props.startAutoBuyerAttempt(
      privpass,
      this.state.account.value,
      this.state.balanceToMaintain,
      this.state.maxFee,
      this.state.maxPriceRelative,
      this.state.maxPriceAbsolute,
      this.state.maxPerBlock,
      this.state.selectedConfigured
    );
    this.setState({passphraseModalOpen: false});
  }
  submitStop() {
    this.props.stopAutoBuyerAttempt();
  }
  closeCurrentAgenda() {
    this.setState({agendaDisplay: null});
  }
  showAgendaOverview(agenda) {
    var selectedChoice = "abstain";
    if (this.state.selectedConfigured.value.VoteChoices !== undefined) {
      for (var i = 0; i < this.state.selectedConfigured.value.VoteChoices.length; i++) {
        if (this.state.selectedConfigured.value.VoteChoices[i] !== undefined &&
        this.state.selectedConfigured.value.VoteChoices[i].agendaId == agenda.getId()) {
          selectedChoice = this.state.selectedConfigured.value.VoteChoices[i].choiceId;
          break;
        }
      }
    }
    this.setState({agendaDisplay: agenda, selectedChoice: selectedChoice});
  }
  showPurchaseInfoModal() {
    this.setState({showPurchaseInfoModal: true});
  }
  closePurchaseInfoModal() {
    this.setState({showPurchaseInfoModal: false});
  }
  showPassphraseModal(heading, description, func) {
    this.setState({modalHeading: heading, modalDescription: description, modalSubmitFunc: func, passphraseModalOpen: true});
  }
  showImportScriptModal(heading, description, func) {
    this.setState({modalScriptHeading: heading, modalScriptDescription: description, modalScriptSubmitFunc: func, importScriptModalOpen: true});
  }
  disableTicketBuyer() {
    this.submitStop();
    this.setState({modalHeading: null, modalDescription: null, modalSubmitFunc: null, passphraseModalOpen: false});
  }
  updateConfiguredStakePool(stakePool) {
    this.setState({selectedConfigured: stakePool});
  }
  updateUnconfiguredStakePool(stakePool) {
    this.setState({selectedUnconfigured: stakePool});
  }
  render() {
    const { walletService } = this.props;
    const { ticketBuyerService } = this.props;
    const { currentStakePoolConfigRequest, currentStakePoolConfigError, activeStakePoolConfig } = this.props;
    const { currentStakePoolConfigSuccessMessage, purchaseTicketsRequestAttempt } = this.props;
    const { purchaseTicketsError, purchaseTicketsSuccess } = this.props;
    const { revokeTicketsError, revokeTicketsSuccess } = this.props;
    const { importScriptError, importScriptSuccess } = this.props;
    const { network, requiredStakepoolAPIVersion } = this.props;
    const { getTicketPriceResponse } = this.props;
    const { getStakeInfoResponse } = this.props;
    const { getAgendasResponse } = this.props;
    const { startAutoBuyerSuccess, startAutoBuyerResponse, stopAutoBuyerSuccess, startAutoBuyerError, stopAutoBuyerError } = this.props;
    const { getTicketBuyerConfigResponse } = this.props;
    var selectAccounts = (
        <Select
          clearable={false}
          style={{zIndex:"9"}}
          onChange={(val) => this.updateAccountNumber(val)}
          placeholder={"Select account..."}
          multi={false}
          value={this.state.account}
          valueKey="value" labelKey="label"
          options={this.state.accountsList}
          />);
    var selectConfiguredStakePool = (
        <Select
          clearable={false}
          style={{zIndex:"9"}}
          onChange={(val) => this.updateConfiguredStakePool(val)}
          placeholder={"Select account..."}
          multi={false}
          value={this.state.selectedConfigured}
          valueKey="value" labelKey="label"
          options={this.state.configuredStakePools}
          />);
    var selectUnconfiguredStakePool = (
        <Select
          clearable={false}
          style={{zIndex:"9"}}
          onChange={(val) => this.updateUnconfiguredStakePool(val)}
          placeholder={"Select account..."}
          multi={false}
          value={this.state.selectedUnconfigured}
          valueKey="value" labelKey="label"
          options={this.state.unconfiguredStakePools}
          />);
    var selectNumTickets = (
      <NumTicketsInput numTickets={this.state.numTickets} incrementNumTickets={()=>this.incrementNumTickets()} decrementNumTickets={()=>this.decrementNumTickets()}/>);

    var apiKeyDescription = (
      <div>
      </div>
    );
    var apiKeyHeading = "Enter private passphrase to connect to your stakepool";
    var apiKeyFunc = (privPass) => this.setStakePoolInfo(privPass);

    var selectedUnconfiguredLabel = null;
    if (this.state.selectedUnconfigured !== undefined) {
      selectedUnconfiguredLabel = this.state.selectedUnconfigured.label;
    }
    var stakePoolConfigInput = (
      <div>
        <PassphraseModal
          hidden={!this.state.passphraseModalOpen}
          submitPassphrase={this.state.modalSubmitFunc}
          cancelPassphrase={()=>this.setState({modalHeading: null, modalDescription: null, modalSubmitFunc: null, passphraseModalOpen: false})}
          heading={this.state.modalHeading}
          description={this.state.modalDescription}
        />
        <div style={!this.state.passphraseModalOpen ? StakePoolStyles.content : StakePoolStyles.contentBlur}>
          <div style={StakePoolStyles.flexHeight}>
            <div style={StakePoolStyles.contentNestFromAddress}>
              <div style={StakePoolStyles.contentNestPrefixSend}>Stake Pool:</div>
              <div style={StakePoolStyles.stakePoolUnconfiguredSelect}>
                {selectUnconfiguredStakePool}
              </div>
              <div style={StakePoolStyles.contentNestFromAddressWalletIcon}></div>
            </div>
            <div style={StakePoolStyles.contentNestApiKeyInstructions}>
              <span>
                Please select your desired stakepool from the above dropdown and follow these instructions:
                <br/>1) Create an account or login to your existing account at <a style={StakePoolStyles.stakepoolLink} onClick={function(x){shell.openExternal(x);}.bind(null, selectedUnconfiguredLabel)}>{selectedUnconfiguredLabel}</a>.
                <br/>2) Once logged in, select the 'Settings' tab.
                <br/>3) Copy and paste your Api Key into the field below (typically starts with 'eyJhb...').
                <br/>4) Click Add and enter your private passphrase.
                <br/>
                <br/>
                <span style={StakePoolStyles.highlighTextOrange}>Notice!</span> If you receive an error about the script not being redeemable when attempting to add your stakepool, you can try the following:
                <br/> - Each stakepool account you create can only be associated with 1 wallet.  If you have previously created this stakepool account with a different wallet (different seed), then you must create a new account.
                <br/> - If you had previously used a 'voting account', for your ticket purchases, please go to the Accounts page and create a new account.  This may now allow you to successfully import your script for your stakepool.
              </span>
            </div>
            <div style={StakePoolStyles.contentNestToAddress}>
              <div style={StakePoolStyles.contentNestApiKey}>
                <div style={StakePoolStyles.inputForm}>
                  <input
                    type="text"
                    style={StakePoolStyles.contentNestAddressAmountSum}
                    placeholder="API Key"
                    onBlur={(e) =>{this.updateApiKey(e.target.value);}}/>
                </div>
              </div>
              <div style={StakePoolStyles.apiKeyError}>
                {this.state.apiKeyError}
              </div>
            </div>
          </div>
          <KeyBlueButton style={StakePoolStyles.contentSend} disabled={this.state.apiKey == ""} onClick={this.state.apiKey == "" ? null : () => this.showPassphraseModal(apiKeyHeading, apiKeyDescription, apiKeyFunc)}>
            Add
          </KeyBlueButton>
          {this.state.purchaseTicketsStakePoolConfig ?
            <SlateGrayButton
              style={StakePoolStyles.hideStakePoolConfig}
              onClick={() => this.cancelAddAnotherStakePool()}>
              Cancel
            </SlateGrayButton> :
            <div></div>
          }
        </div>
      </div>
    );
    var votingGuiView = (
      <div style={StakePoolStyles.contentVotingGui}>
        <div style={StakePoolStyles.votingTitleArea}>
          <div style={StakePoolStyles.votingTitleAreaName}>Voting Preferences</div>
          <div style={StakePoolStyles.stakePoolUnconfiguredSelect}>{selectConfiguredStakePool}</div>
        </div>
        {this.state.selectedConfigured !== undefined  && this.state.selectedConfigured.value.APIVersionsSupported[1] == requiredStakepoolAPIVersion ?
        <div style={StakePoolStyles.votingAgendaArea}>
          {this.state.agendaDisplay !== null && this.state.selectedConfigured !== null ?
            <AgendaOverview agenda={this.state.agendaDisplay} selectedChoice={this.state.selectedChoice} closeCurrentAgenda={() => this.closeCurrentAgenda()} selectAgendaChoice={() => this.selectAgendaChoice()} updatePreferences={(agendaId, choiceId) =>this.props.setVoteChoicesAttempt(this.state.selectedConfigured.value, agendaId, choiceId)}/>:
            <div></div>
          }
          {getAgendasResponse !== null && this.state.selectedConfigured !== null ? getAgendasResponse.getAgendasList().length > 0 ?
            getAgendasResponse.getAgendasList().map((agenda) => {
              var selectedChoice = "abstain";
              if (this.state.selectedConfigured.value.VoteChoices !== undefined) {
                for (var i = 0; i < this.state.selectedConfigured.value.VoteChoices.length; i++) {
                  if (this.state.selectedConfigured.value.VoteChoices[i] !== undefined &&
                  this.state.selectedConfigured.value.VoteChoices[i].agendaId == agenda.getId()) {
                    selectedChoice = this.state.selectedConfigured.value.VoteChoices[i].choiceId;
                    break;
                  }
                }
              }
              if (this.state.agendaDisplay == null || (this.state.agendaDisplay !== null && agenda.getId() !== this.state.agendaDisplay.getId())) {
                return(<AgendaCard key={agenda.getId()} agenda={agenda} selectedChoice={selectedChoice} onClick={() => this.showAgendaOverview(agenda)}/>);
              }
            }):
            <div style={StakePoolStyles.noAgendasMessage}>There are currently no agendas for voting.</div>:
          <div style={StakePoolStyles.noAgendasMessage}>There are currently no agendas for voting.</div>
          }
        </div> :
        <div style={StakePoolStyles.votingAgendaArea}>
          <div style={StakePoolStyles.noAgendasMessage}>This pool is not configured for vote choices.</div>
        </div>}
      </div>
    );
    var configuredStakePoolInformation = (
        <div style={StakePoolStyles.content}>
          <div style={StakePoolStyles.flexHeight}>
            <div style={StakePoolStyles.contentNestFromAddress}>
              <div style={StakePoolStyles.contentNestPrefixConfigured}>Configured stake pools:</div>
            </div>
            <div id="dynamicInput">
            {this.state.configuredStakePools.map((stakePool) => {
              if (stakePool.value.ApiKey && stakePool.value.Network == network) {
                return(
                <div key={stakePool.value.Host} style={StakePoolStyles.contentNestStakePool}>
                  <div style={StakePoolStyles.contentNestStakePoolSettings}>
                    <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>URL:</div>
                    <div style={StakePoolStyles.contentNestContentStakePoolSettings}>
                      {stakePool.value.Host}
                    </div>
                  </div>
                  <div style={StakePoolStyles.contentNestStakePoolSettings}>
                    <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>Ticket Address:</div>
                    <div style={StakePoolStyles.contentNestContentStakePoolSettings}>
                      {stakePool.value.TicketAddress}
                    </div>
                  </div>
                  <div style={StakePoolStyles.contentNestStakePoolSettings}>
                    <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>Script:</div>
                    <textarea disabled value={stakePool.value.Script} style={StakePoolStyles.contentNestContentStakePoolSettings}/>
                  </div>
                  <div style={StakePoolStyles.contentNestStakePoolSettingsBottom}>
                    <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>Pool Fees:</div>
                    <div style={StakePoolStyles.contentNestContentStakePoolSettings}>
                      {stakePool.value.PoolFees}
                    </div>
                  </div>
                </div>);
              }
            })}
            </div>
          </div>
          {this.state.unconfiguredStakePools.length > 0 ?
          <KeyBlueButton style={StakePoolStyles.contentSend} onClick={() => this.addAnotherStakePool()}>
            Add stakepool
          </KeyBlueButton> :
          <div></div>
          }
          {this.state.purchaseTicketsStakePoolConfig ?
            <SlateGrayButton
              style={StakePoolStyles.hideStakePoolConfig}
              onClick={() => this.hideStakePoolConfig()}>
              Cancel
            </SlateGrayButton> :
            <div>
            </div>
          }
        </div>
    );
    var stakeInfoArea = (
      getStakeInfoResponse !== null ?
        this.state.stakeInfoHidden ?
          <div style={StakePoolStyles.stakeInfoAreaSmall}>
              <div style={StakePoolStyles.stakeInfoRowSmall}>
                <div style={StakePoolStyles.stakeInfoLabel}>Own Mempool Tickets:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getOwnMempoolTix()}</div>
              </div>
              <div style={StakePoolStyles.stakeInfoRowSmall}>
                <div style={StakePoolStyles.stakeInfoLabel}>Immature Tickets:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getImmature()}</div>
              </div>
              <div style={StakePoolStyles.stakeInfoRowSmallRight}>
                <div style={StakePoolStyles.stakeInfoLabel}>Live Tickets:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getLive()}</div>
                <TicketsCogs opened={this.state.stakeInfoHidden} style={{paddingTop: "2px"}} onClick={this.state.stakeInfoHidden ? () => this.showStakeInfo() : () => this.hideStakeInfo()}/>
              </div>
          </div>:
          <div style={StakePoolStyles.stakeInfoArea}>
            <div style={StakePoolStyles.stakeInfoRow}>
              <div style={StakePoolStyles.stakeInfoRowLeft}>
                <div style={StakePoolStyles.stakeInfoLabel}>Poolsize:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getPoolSize()}</div>
              </div>
              <div style={StakePoolStyles.stakeInfoRowRight}>
                <div style={StakePoolStyles.stakeInfoLabel}>Voted Tickets:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getVoted()}</div>
                <TicketsCogs opened={this.state.stakeInfoHidden} style={{paddingTop: "2px"}} onClick={this.state.stakeInfoHidden ? () => this.showStakeInfo() : () => this.hideStakeInfo()}/>
              </div>
            </div>
            <div style={StakePoolStyles.stakeInfoRow}>
              <div style={StakePoolStyles.stakeInfoRowLeft}>
                <div style={StakePoolStyles.stakeInfoLabel}>All Mempool Tickets:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getAllMempoolTix()}</div>
              </div>
              <div style={StakePoolStyles.stakeInfoRowRight}>
                <div style={StakePoolStyles.stakeInfoLabel}>Missed Tickets:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getMissed()}</div>
              </div>
            </div>
            <div style={StakePoolStyles.stakeInfoRow}>
              <div style={StakePoolStyles.stakeInfoRowLeft}>
                <div style={StakePoolStyles.stakeInfoLabel}>Own Mempool Tickets:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getOwnMempoolTix()}</div>
              </div>
              <div style={StakePoolStyles.stakeInfoRowRight}>
                <div style={StakePoolStyles.stakeInfoLabel}>Revoked Tickets:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getRevoked()}</div>
              </div>
            </div>
            <div style={StakePoolStyles.stakeInfoRow}>
              <div style={StakePoolStyles.stakeInfoRowLeft}>
                <div style={StakePoolStyles.stakeInfoLabel}>Immature Tickets:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getImmature()}</div>
              </div>
              <div style={StakePoolStyles.stakeInfoRowRight}>
                <div style={StakePoolStyles.stakeInfoLabel}>Expired Tickets:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getExpired()}</div>
              </div>
            </div>
            <div style={StakePoolStyles.stakeInfoRow}>
              <div style={StakePoolStyles.stakeInfoRowLeft}>
                <div style={StakePoolStyles.stakeInfoLabel}>Live Tickets:</div>
                <div style={StakePoolStyles.stakeInfoValue}>{getStakeInfoResponse.getLive()}</div>
              </div>
            </div>
          </div>:
          <div>
          </div>);
    var purchaseTicketsInfoModal = (
        <PurchaseTicketsInfo closeModal={()=>this.closePurchaseInfoModal()}/>
    );
    var startAutoBuyerDescription = (
      <div>
        <span style={StakePoolStyles.highlightTextNeonGreen}>Notice!</span> &nbsp;Automatic ticket purchase will continue as long as the wallet is running.
        <br/>When the wallet is closed, tickets are not purchased. When the wallet is restarted
        <br/>the automatic purchase will need to enabled again with the Toggle.
      </div>
    );
    var startAutoBuyerHeading = "Enter Passphrase to Start Autobuyer";
    var startAutoBuyerFunc = (privPass) => this.submitStart(privPass);
    var revokeTicketDescription = (
      <div>
      </div>
    );
    var revokeTicketHeading = "Enter Passphrase to Revoke Tickets";
    var revokeTicketFunc = (privPass) => this.submitRevoke(privPass);
    var purchaseTicketDescription = (
      <div>
      </div>
    );
    var purchaseTicketHeading = "Enter Passphrase to Purchase Tickets";
    var purchaseTicketFunc = (privPass) => this.submitPurchase(privPass);
    var importScriptDescription = (
      <div>
        Please enter your Script from your configured stakepool:
      </div>
    );
    var importScriptHeading = "Enter Passphrase to Import Script";
    var importScriptFunc = (privPass, script) => this.importScript(privPass, script);
    var purchaseTicketsView = (
      <div>
        <PassphraseModal
          hidden={!this.state.passphraseModalOpen}
          submitPassphrase={this.state.modalSubmitFunc}
          cancelPassphrase={()=>this.setState({modalHeading: null, modalDescription: null, modalSubmitFunc: null, passphraseModalOpen: false})}
          heading={this.state.modalHeading}
          description={this.state.modalDescription}
        />
        <ImportScriptModal
          hidden={!this.state.importScriptModalOpen}
          submitImportScript={this.state.modalScriptSubmitFunc}
          cancelImportScript={()=>this.setState({modalScriptHeading: null, modalScriptDescription: null, modalScriptSubmitFunc: null, importScriptModalOpen: false})}
          heading={this.state.modalScriptHeading}
          description={this.state.modalScriptDescription}
        />
        <div style={this.state.passphraseModalOpen || this.state.importScriptModalOpen ? StakePoolStyles.contentPurchaseTicketViewBlur : StakePoolStyles.contentPurchaseTicketView}>
          {stakeInfoArea}
          <div style={StakePoolStyles.votingTitleArea}>
            <div style={StakePoolStyles.votingTitleAreaName}>Purchase Tickets</div>
          </div>
          <div style={StakePoolStyles.purchaseTicketInputButtons}>
            <PurchaseTicketsInfoButton onClick={() => this.showPurchaseInfoModal()}/>
            <TicketsCogs opened={this.state.advancedHidden} onClick={this.state.advancedHidden ? () => this.showAdvanced() : () => this.hideAdvanced()}/>
          </div>
          <div style={this.state.advancedHidden ? StakePoolStyles.flexHeightHidden : StakePoolStyles.flexHeightShown }>
            <div style={StakePoolStyles.purchaseTicketRow}>
              <div style={StakePoolStyles.purchaseTicketRowAccountSelect}>
                <div style={StakePoolStyles.purchaseTicketAccountSelectLabel}>Account:</div>
                <div style={StakePoolStyles.purchaseTicketInputSelect}>
                  {selectAccounts}
                </div>
                <Link
                  ref="accountButtonRef"
                  className="accounts-button-icon"
                  data-place="bottom"
                  data-type="info"
                  data-effect="solid"
                  data-tip={"Accounts"}
                  to={"/accounts"} />
              </div>
              <div style={StakePoolStyles.purchaseTicketRowNumTickets}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Number of Tickets:</div>
                <div style={StakePoolStyles.purchaseTicketNumSelect}>
                  {selectNumTickets}
                </div>
                <div style={StakePoolStyles.purchaseTicketInputError}>
                  {this.state.numTicketsError}
                </div>
              </div>
            </div>
            <div hidden={this.state.advancedHidden ? true : false}>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>
                  Stake Pool:
                  </div>
                <div style={StakePoolStyles.purchaseTicketInputSelect}>
                  {selectConfiguredStakePool}
                </div>
                <div style={StakePoolStyles.managePoolButtonArea}>
                  <ManagePoolsButton onClick={() => this.showStakePoolConfig()}/>
                </div>
              </div>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketRowThirds}>
                  <div style={StakePoolStyles.purchaseTicketLabel}>Ticket Fee (DCR/kB):</div>
                  <div style={StakePoolStyles.purchaseTicketThirdsInput}>
                    <div style={StakePoolStyles.inputFormPurchaseTicket}>
                      <input
                        type="text"
                        style={StakePoolStyles.contentNestPurchaseTicketForm}
                        placeholder="Ticket Fee"
                        defaultValue={0.001}
                        onBlur={(e) =>{this.updateTicketFee(e.target.value);}}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.purchaseTicketInputError}>
                    {this.state.ticketFeeError}
                  </div>
                </div>
                <div style={StakePoolStyles.purchaseTicketRowThirds}>
                  <div style={StakePoolStyles.purchaseTicketLabel}>Tx Fee (DCR/kB):</div>
                  <div style={StakePoolStyles.purchaseTicketThirdsInput}>
                    <div style={StakePoolStyles.inputFormPurchaseTicket}>
                      <input
                        type="text"
                        style={StakePoolStyles.contentNestPurchaseTicketForm}
                        placeholder="Tx Fee"
                        defaultValue={0.001}
                        onBlur={(e) =>{this.updateTxFee(e.target.value);}}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.purchaseTicketInputError}>
                    {this.state.txFeeError}
                  </div>
                </div>
                <div style={StakePoolStyles.purchaseTicketRowThirds}>
                  <div style={StakePoolStyles.purchaseTicketLabel}>Expiry:</div>
                  <div style={StakePoolStyles.purchaseTicketThirdsInput}>
                    <div style={StakePoolStyles.inputFormPurchaseTicket}>
                      <input
                        type="text"
                        style={StakePoolStyles.contentNestPurchaseTicketForm}
                        placeholder="Expiry"
                        defaultValue={this.state.expiry}
                        onBlur={(e) =>{this.updateExpiry(e.target.value);}}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.purchaseTicketInputError}>
                    {this.state.expiryError}
                  </div>
                </div>
              </div>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Ticket Address:</div>
                <div style={StakePoolStyles.purchaseTicketAddressInput}>
                  <div style={StakePoolStyles.inputFormPurchaseTicket}>
                    <input
                      type="text"
                      disabled
                      style={StakePoolStyles.contentNestPurchaseTicketFormDisabled}
                      value={this.state.selectedConfigured != null ? this.state.selectedConfigured.value.TicketAddress : null}/>
                  </div>
                </div>
              </div>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Pool Address:</div>
                <div style={StakePoolStyles.purchaseTicketAddressInput}>
                  <div style={StakePoolStyles.inputFormPurchaseTicket}>
                    <input
                      disabled
                      type="text"
                      style={StakePoolStyles.contentNestPurchaseTicketFormDisabled}
                      value={this.state.selectedConfigured != null ? this.state.selectedConfigured.value.PoolAddress : null}/>
                  </div>
                </div>
              </div>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketRowLeft}>
                  <div style={StakePoolStyles.purchaseTicketLabel}>Pool Fees:</div>
                  <div style={StakePoolStyles.purchaseTicketNumInput}>
                    <div style={StakePoolStyles.inputFormPurchaseTicket}>
                      <input
                        disabled
                        type="text"
                        style={StakePoolStyles.contentNestPurchaseTicketFormDisabled}
                        value={this.state.selectedConfigured != null ? this.state.selectedConfigured.value.PoolFees : null}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div hidden={this.state.advancedHidden ? false : true} style={StakePoolStyles.purchaseTicketQuickBarRow}>
              <div style={StakePoolStyles.quickBarRowLabel}>Settings:</div>
             <div style={StakePoolStyles.stakepoolIcon} data-tip="Current Stakepool">{this.state.selectedConfigured != null ? this.state.selectedConfigured.value.Host : null}</div>
              <div style={StakePoolStyles.feeIcon} data-tip="Ticket Fee">{this.state.ticketFee} DCR/KB</div>
              <div style={StakePoolStyles.feeIcon} data-tip="Tx Fee">{this.state.txFee} DCR/KB</div>
              <div style={StakePoolStyles.expiryIcon} data-tip="Expiry">{this.state.expiry} Blocks</div>
              <div style={StakePoolStyles.ticketAddressIcon} data-tip="Ticket Address">{this.state.selectedConfigured != null ? addSpacingAroundText(this.state.selectedConfigured.value.TicketAddress) : null}</div>
              <div style={StakePoolStyles.feeAddressIcon} data-tip="Pool Address">{this.state.selectedConfigured != null ? addSpacingAroundText(this.state.selectedConfigured.value.PoolAddress) : null}</div>
              <div style={StakePoolStyles.poolFeeIcon} data-tip="Pool Fee">{this.state.selectedConfigured != null ? this.state.selectedConfigured.value.PoolFees : null}%</div>
            </div>
          </div>
          <div style={StakePoolStyles.purchaseTicketButtonsArea}>
            <KeyBlueButton style={StakePoolStyles.contentPurchaseButton} disabled={getTicketPriceResponse !== null ? this.state.spendLimit < getTicketPriceResponse.getTicketPrice() || this.state.numTickets <= 0: true} onClick={getTicketPriceResponse !== null ? this.state.spendLimit < getTicketPriceResponse.getTicketPrice() || this.state.numTickets <= 0 ? null : () => this.showPassphraseModal(purchaseTicketHeading, purchaseTicketDescription, purchaseTicketFunc) : null}>
              Purchase
            </KeyBlueButton>
            {getTicketPriceResponse !== null && this.state.spendLimit < getTicketPriceResponse.getTicketPrice() ?
            <span style={{color: "red", float: "left", paddingLeft: "20px", paddingTop: "19px"}}>
              Insufficient spendable account balance to purchase tickets.
            </span> :
            <div/>
            }
            <KeyBlueButton style={StakePoolStyles.contentImportScriptButton} onClick={() => this.showImportScriptModal(importScriptHeading, importScriptDescription, importScriptFunc)}>
              Import Script
            </KeyBlueButton>
            <KeyBlueButton style={StakePoolStyles.contentRevokeButton} onClick={() => this.showPassphraseModal(revokeTicketHeading, revokeTicketDescription, revokeTicketFunc)}>
              Revoke
            </KeyBlueButton>
          </div>
          <div style={StakePoolStyles.areaSpacing}></div>
          <div style={StakePoolStyles.votingTitleArea}>
            <div style={StakePoolStyles.votingTitleAreaName}>Automatic Purchase</div>
          </div>
          <div style={this.state.autoBuyerHidden ? StakePoolStyles.flexHeightAutoBuyerHidden : StakePoolStyles.flexHeightAutoBuyerShown }>
            <div style={StakePoolStyles.autoBuyerRow}>
              <AutoBuyerSwitch enabled={startAutoBuyerResponse} onClick={startAutoBuyerResponse ? ()=>this.disableTicketBuyer() : ()=>this.showPassphraseModal(startAutoBuyerHeading, startAutoBuyerDescription, startAutoBuyerFunc)}/>
              <div style={StakePoolStyles.autoBuyerLabel}>{startAutoBuyerResponse ? "Enabled" : "Disabled"}</div>
              <div style={StakePoolStyles.autoBuyerQuickBarRow}>
                {this.state.autoBuyerHidden ?
                  <div>
                    <div style={StakePoolStyles.autoBuyerIconAreas} data-tip="Balance To Maintain"><div style={StakePoolStyles.balanceToMaintainIcon}/>{this.state.balanceToMaintain}</div>
                    <div style={StakePoolStyles.autoBuyerIconAreas} data-tip="Max Fee"><div style={StakePoolStyles.maxFeeIcon}/>{this.state.maxFee} DCR</div>
                    <div style={StakePoolStyles.autoBuyerIconAreas} data-tip="Max Price Absolute"><div style={StakePoolStyles.maxPriceAbsoluteIcon}/>{this.state.maxPriceAbsolute} DCR</div>
                    <div style={StakePoolStyles.autoBuyerIconAreas} data-tip="Max Price Relative"><div style={StakePoolStyles.maxPriceRelativeIcon}/>{this.state.maxPriceRelative}%</div>
                    <div style={StakePoolStyles.autoBuyerIconAreas} data-tip="Max Per Block"><div style={StakePoolStyles.maxPerBlockIcon}/>{this.state.maxPerBlock}</div>
                  </div>:
                  <div></div>}
              </div>
              <div style={StakePoolStyles.autoBuyerShowAdvancedArea}>
                <TicketsCogs opened={this.state.autoBuyerHidden} onClick={this.state.autoBuyerHidden ? () => this.showAutoBuyer() : () => this.hideAutoBuyer()}/>
              </div>
            </div>
            <div hidden={this.state.autoBuyerHidden ? true : false}>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketRowLeft}>
                  <div style={StakePoolStyles.autoBuyerIconAreasExpand}><div style={StakePoolStyles.balanceToMaintainIcon}/>Balance to maintain:</div>
                  <div style={StakePoolStyles.purchaseTicketNumInput}>
                    <div style={StakePoolStyles.inputFormPurchaseTicket}>
                      <input
                        type="text"
                        style={StakePoolStyles.contentNestPurchaseTicketForm}
                        placeholder="Balance to Maintain"
                        defaultValue={this.state.balanceToMaintain}
                        onBlur={(e) =>{this.updateBalanceToMaintain(e.target.value);}}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.purchaseTicketInputError}>
                    {this.state.balanceToMaintainError}
                  </div>
                </div>
                <div style={StakePoolStyles.purchaseTicketRowRight}>
                  <div style={StakePoolStyles.autoBuyerIconAreasExpand}><div style={StakePoolStyles.maxFeeIcon}/>Max Fee:</div>
                  <div style={StakePoolStyles.purchaseTicketNumInput}>
                    <div style={StakePoolStyles.inputFormPurchaseTicket}>
                      <input
                        type="text"
                        style={StakePoolStyles.contentNestPurchaseTicketForm}
                        placeholder="Max Fee"
                        defaultValue={this.state.maxFee}
                        onBlur={(e) =>{this.updateMaxFee(e.target.value);}}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.purchaseTicketInputError}>
                    {this.state.maxFeeError}
                  </div>
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
                        defaultValue={this.state.maxPriceAbsolute}
                        onBlur={(e) =>{this.updateMaxPriceAbsolute(e.target.value);}}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.purchaseTicketInputError}>
                    {this.state.maxPriceAbsoluteError}
                  </div>
                </div>
                <div style={StakePoolStyles.purchaseTicketRowRight}>
                  <div style={StakePoolStyles.autoBuyerIconAreasExpand}><div style={StakePoolStyles.maxPriceRelativeIcon}/>Max Price Relative:</div>
                  <div style={StakePoolStyles.purchaseTicketNumInput}>
                    <div style={StakePoolStyles.inputFormPurchaseTicket}>
                      <input
                        type="text"
                        style={StakePoolStyles.contentNestPurchaseTicketForm}
                        placeholder="Max Price Relative"
                        defaultValue={this.state.maxPriceRelative}
                        onBlur={(e) =>{this.updateMaxPriceRelative(e.target.value);}}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.purchaseTicketInputError}>
                    {this.state.maxPriceRelativeError}
                  </div>
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
                      defaultValue={this.state.maxPerBlock}
                      onBlur={(e) =>{this.updateMaxPerBlock(e.target.value);}}/>
                  </div>
                </div>
                <div style={StakePoolStyles.purchaseTicketInputError}>
                  {this.state.maxPerBlockError}
                </div>
              </div>
              <div hidden={getTicketBuyerConfigResponse == null}>
                <KeyBlueButton style={StakePoolStyles.contentPurchaseButton} disabled={!this.state.autoBuyerConfigChanged} onClick={this.state.autoBuyerConfigChanged ? () => this.updateAutoBuyerSettings() : null}>
                  Update Config
                </KeyBlueButton>
              </div>
            </div>
          </div>
        </div>
      </div>);
    const stakePool = (
      <div style={StakePoolStyles.view}>
        <Header
          headerTop={
          [
            currentStakePoolConfigError !== null ?
            <div key="updateStakePoolError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStakePoolConfigError()}/>{currentStakePoolConfigError}</div> :
            <div key="updateStakePoolError" ></div>,
            currentStakePoolConfigSuccessMessage !== undefined && currentStakePoolConfigSuccessMessage !== "" ?
            <div key="configSuccess"  style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStakePoolConfigSuccess()}/>{currentStakePoolConfigSuccessMessage}</div> :
            <div key="configSuccess" ></div>,
            purchaseTicketsError !== null ?
            <div key="purchaseTicketsError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearPurchaseTicketsError()}/>{purchaseTicketsError}</div> :
            <div key="purchaseTicketsError" ></div>,
            purchaseTicketsSuccess !== undefined && purchaseTicketsSuccess !== "" ?
            <div key="purchaseTicketsSuccess" style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearPurchaseTicketsSuccess()}/>{purchaseTicketsSuccess}</div> :
            <div key="purchaseTicketsSuccess" ></div>,
            revokeTicketsError !== null ?
            <div key="revokeTicketsError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearRevokeTicketsError()}/>{revokeTicketsError}</div> :
            <div key="revokeTicketsError" ></div>,
            revokeTicketsSuccess !== undefined && revokeTicketsSuccess !== "" ?
            <div key="revokeTicketsSuccess" style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearRevokeTicketsSuccess()}/>{revokeTicketsSuccess}</div> :
            <div key="revokeTicketsSuccess" ></div>,
            startAutoBuyerSuccess !== null && startAutoBuyerSuccess !== "" ?
            <div key="startAutoBuyerSuccess" style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStartAutoBuyerSuccess()}/>{startAutoBuyerSuccess}</div> :
            <div key="startAutoBuyerSuccess" ></div>,
            stopAutoBuyerSuccess !== null && stopAutoBuyerSuccess !== "" ?
            <div key="stopAutoBuyerSuccess" style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStopAutoBuyerSuccess()}/>{stopAutoBuyerSuccess}</div> :
            <div key="stopAutoBuyerSuccess" ></div>,
            startAutoBuyerError !== null && startAutoBuyerError !== "" ?
            <div key="startAutoBuyerError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStartAutoBuyerError()}/>{startAutoBuyerError}</div> :
            <div key="startAutoBuyerError" ></div>,
            stopAutoBuyerError !== null && stopAutoBuyerError !== "" ?
            <div key="stopAutoBuyerError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStopAutoBuyerError()}/>{stopAutoBuyerError}</div> :
            <div key="stopAutoBuyerError" ></div>,
            importScriptError !== null ?
            <div key="importScriptError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearImportScriptError()}/>{importScriptError}</div> :
            <div key="importScriptError" ></div>,
            importScriptSuccess !== undefined && importScriptSuccess !== "" ?
            <div key="importScriptSuccess" style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearImportScriptSuccess()}/>{importScriptSuccess}</div> :
            <div key="importScriptSuccess" ></div>,
          ]
          }
          headerTitleOverview={
            <div style={{height: "100%"}}>
              <div style={{float: "left"}}>{this.state.purchaseTickets ? activeStakePoolConfig ? "Ticket price:" : "" : "Stake pool settings"}</div>
            </div>
          }
          headerMetaOverview={
            activeStakePoolConfig && !this.state.addAnotherStakePool && getTicketPriceResponse !== null ?
            <div>
             <Balance amount={getTicketPriceResponse.getTicketPrice()}/>
              <div style={StakePoolStyles.toggle}>
                <TextToggle
                  activeButton={"left"}
                  leftText={"Purchase Tickets"}
                  rightText={"Vote settings"}
                  toggleAction={(e)=>{this.toggleTicketStakePool(e);}}/>
              </div></div>:
            <div></div>

          }
        />
        {(!activeStakePoolConfig || this.state.addAnotherStakePool) && !currentStakePoolConfigRequest ?
          stakePoolConfigInput :
          currentStakePoolConfigRequest || purchaseTicketsRequestAttempt ?
          <div style={StakePoolStyles.content}>
            <StakeyBounce/>
          </div> :
              this.state.purchaseTickets ?
                this.state.purchaseTicketsStakePoolConfig ?
                  configuredStakePoolInformation :
                    this.state.showPurchaseInfoModal ?
                      purchaseTicketsInfoModal :
                        purchaseTicketsView :
                        votingGuiView
        }
      </div>
    );
    if ((walletService === null) || (ticketBuyerService === null)){
      return (<ErrorScreen />);
    } else {
      return (
        <div style={StakePoolStyles.body}>
          <SideBar />
          {stakePool}
          <ReactToolTip type="info" effect="solid"/>
        </div>);
    }
  }
}

export default StakePool;
