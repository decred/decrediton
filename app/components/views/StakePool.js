// @flow
import React, { Component } from 'react';
import { shell } from 'electron';
import { PropTypes } from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorScreen from '../ErrorScreen';
import Balance from '../Balance';
import SideBar from '../SideBar';
import Header from '../Header';
import NewExistingSeedToggle from '../NewExistingSeedToggle';
import KeyBlueButton from '../KeyBlueButton';
import SlateGrayButton from '../SlateGrayButton';
import { StakePoolStyles } from './ViewStyles';
import AgendaCard from '../AgendaCard';
import AgendaOverview from '../AgendaOverview';
import PurchaseTicketsInfo from '../PurchaseTicketsInfo';
import PurchaseTicketsInfoButton from '../PurchaseTicketsInfoButton';
import TicketsCogs from '../TicketsCogs';
import NumTicketsInput from '../NumTicketsInput';
import ManagePoolsButton from '../ManagePoolsButton';
import AutoBuyerSwitch from '../AutoBuyerSwitch';
import PassphraseModal from '../PassphraseModal';
import ImportScriptModal from '../ImportScriptModal';

class StakePool extends Component{
  static propTypes = {
    walletService: PropTypes.object,
    ticketBuyerService: PropTypes.object,
  };
  constructor(props) {
    super(props);
    var initStakePoolHost = '';
    var initStakePool = null;
    // Look for any available uninitialized stakepool config
    // This will be set for the first in the dropdown for
    // setting apikey/purchase information of the stakepool.
    if (this.props.currentStakePoolConfig != null) {
      for (var i = 0; i < this.props.currentStakePoolConfig.length; i++) {
        if (!this.props.currentStakePoolConfig[i].ApiKey && this.props.currentStakePoolConfig[i].Network == this.props.network) {
          initStakePoolHost = this.props.currentStakePoolConfig[i].Host;
          break;
        }
      }
      // Look for any available initialized stakepool config
      // This will be set for the first in the dropdown for
      // ticket purchase stake pool selection.
      for (var j = 0; j < this.props.currentStakePoolConfig.length; j++) {
        if (this.props.currentStakePoolConfig[j].ApiKey && this.props.currentStakePoolConfig[j].Network == this.props.network) {
          initStakePool = this.props.currentStakePoolConfig[j];
          break;
        }
      }
    }
    var defaultSpendLimit = 0;
    if (this.props.balances != null) {
      for (i = 0; i < this.props.balances.length; i++) {
        if (this.props.balances[i].accountNumber == 0) {
          defaultSpendLimit = this.props.balances[i].spendable;
        }
      }
    }
    this.state = {
      stakePoolHost: initStakePoolHost,
      apiKey: '',
      account: 0,
      addAnotherStakePool: false,
      purchaseTickets: true,
      purchaseTicketsStakePoolConfig: false,
      showPurchaseInfoModal: false,
      passphraseModalOpen: false,
      spendLimit: defaultSpendLimit,
      conf: 0,
      numTickets: 1,
      expiry: 16,
      txFee: 0.01, // DCR/kB
      ticketFee: 0.01, // DCR/kB
      selectedStakePoolForPurchase: initStakePool,
      selectedStakePoolForVoting: initStakePool,
      advancedHidden: true,
      autoBuyerHidden: true,
      choice: 'option1',

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
  componentWillReceiveProps(nextProps) {
    if (this.props.balances != nextProps.balances) {
      var newAccountSpendableBalance = 0;
      for (var i = 0; i < nextProps.balances; i++) {
        if (nextProps.balances[i].accountNumber == this.state.account) {
          newAccountSpendableBalance = nextProps.balances[i].spendable;
          break;
        }
      }
      this.setState({spendLimit: newAccountSpendableBalance});
    }
    if (this.props.currentStakePoolConfig != nextProps.currentStakePoolConfig) {
      for (var j = 0; j < nextProps.currentStakePoolConfig.length; j++) {
        if (nextProps.currentStakePoolConfig[j].ApiKey && nextProps.currentStakePoolConfig[j].Network == this.props.network) {
          this.setState({selectedStakePoolForPurchase: nextProps.currentStakePoolConfig[j]});
        }
        if (this.state.selectedStakePoolForVoting !== null && nextProps.currentStakePoolConfig[j].Host == this.state.selectedStakePoolForVoting.Host) {
          this.setState({selectedStakePoolForVoting: nextProps.currentStakePoolConfig[j]});
        }
      }
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
    if (this.state.selectedStakePoolForPurchase == null ||
       this.state.numTicketsError !== null || this.state.txFeeError !== null ||
       this.state.ticketFeeError !== null || this.state.expiryError !== null ||
       this.state.privPassError !== null) {
      checkErrors = true;
    }
    if (this.state.numTickets == 0) {
      this.setState({numTicketsError: '*You must purchase 1 or more tickets.'});
      checkErrors = true;
    }
    if (checkErrors) {
      return;
    }
    this.props.purchaseTicketsAttempt(
      privpass,
      this.state.account,
      this.state.spendLimit,
      this.state.conf,
      this.state.numTickets,
      this.state.expiry,
      this.state.ticketFee,
      this.state.txFee,
      this.state.selectedStakePoolForPurchase,
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
      var err = '*Please enter a valid max fee (> 0)';
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
      var err = '*Please enter a valid max fee (> 0)';
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
      var err = '*Please enter a value max price absolute (> 0)';
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
      var err = '*Please enter a value max price relative (> 0)';
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
      var err = '*Please enter a value max per block (> 0)';
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
      this.state.account,
      this.state.balanceToMaintain,
      this.state.maxFee,
      this.state.maxPriceAbsolute,
      this.state.maxPriceRelative,
      this.state.selectedStakePoolForPurchase,
      this.state.maxPerBlock
    );
  }
  showStakePoolConfig() {
    this.setState({purchaseTicketsStakePoolConfig: true});
  }
  hideStakePoolConfig() {
    this.setState({purchaseTicketsStakePoolConfig: false});
  }
  updateAccountNumber(accountNum) {
    this.setState({account: accountNum});
    if (this.props.balances !== null) {
      var updatedAccountSpendLimit = 0;
      for (var i = 0; i < this.props.balances.length; i++) {
        if (this.props.balances[i].accountNumber == accountNum) {
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
      this.setState({ticketFeeError: '*Invalid ticket fee (0 - 1 DCR/KB)'});
    }
  }
  updateTxFee(txFee) {
    if (!isNaN(txFee) && txFee > 0 && txFee < 1) {
      this.setState({txFee: txFee, txFeeError: null});
    } else {
      this.setState({txFeeError: '*Invalid tx fee (0 - 1 DCR/KB)'});
    }
  }
  updateExpiry(expiry) {
    if (!isNaN(expiry) && expiry >= 0) {
      this.setState({expiry: expiry, expiryError: null});
    } else {
      this.setState({expiryError: '*Invalid expiry (>= 0)'});
    }
  }
  addAnotherStakePool() {
    this.setState({addAnotherStakePool: true});
  }
  cancelAddAnotherStakePool() {
    this.setState({addAnotherStakePool: false});
  }
  setStakePoolInfo(privpass) {
    if (this.state.apiKey == '') {
      this.setState({apiKeyError: '*Please enter your API key'});
      return;
    }
    if (this.state.stakePoolHost == '' || this.state.apiKeyError !== null) {
      return;
    }
    this.props.setStakePoolInformation(privpass, this.state.stakePoolHost, this.state.apiKey, 0);
    setTimeout(this.setState({passphraseModalOpen: false, addAnotherStakePool: false}), 1000);
  }
  updateApiKey(apiKey) {
    if (apiKey != '') {
      this.setState({apiKey: apiKey, apiKeyError: null});
    } else {
      this.setState({apiKeyError: '*Please enter your API key'});
    }
  }
  updateStakePoolHost(poolHost) {
    this.setState({stakePoolHost: poolHost});
  }
  updateStakePoolPurchaseTickets(poolHost) {
    for (var i = 0; i < this.props.currentStakePoolConfig.length; i++) {
      if (this.props.currentStakePoolConfig[i].Host == poolHost) {
        this.setState({selectedStakePoolForPurchase: this.props.currentStakePoolConfig[i]});
        break;
      }
    }
  }
  updateStakePoolVotingPreferences(poolHost) {
    for (var i = 0; i < this.props.currentStakePoolConfig.length; i++) {
      if (this.props.currentStakePoolConfig[i].Host == poolHost) {
        this.setState({selectedStakePoolForVoting: this.props.currentStakePoolConfig[i]});
        break;
      }
    }
  }
  toggleTicketStakePool(side) {
    if (side == 'right') {
      this.setState({purchaseTickets: false, purchaseTicketsStakePoolConfig: false});
    } else if (side == 'left') {
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
      this.state.account,
      this.state.balanceToMaintain,
      this.state.maxFee,
      this.state.maxPriceRelative,
      this.state.maxPriceAbsolute,
      this.state.maxPerBlock,
      this.state.selectedStakePoolForPurchase
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
    var selectedChoice = 'abstain';
    if (this.state.selectedStakePoolForVoting.VoteChoices !== undefined) {
      for (var i = 0; i < this.state.selectedStakePoolForVoting.VoteChoices.length; i++) {
        if (this.state.selectedStakePoolForVoting.VoteChoices[i] !== undefined &&
        this.state.selectedStakePoolForVoting.VoteChoices[i].agendaId == agenda.getId()) {
          selectedChoice = this.state.selectedStakePoolForVoting.VoteChoices[i].choiceId;
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
  render() {
    const { walletService } = this.props;
    const { currentSettings } = this.props;
    const { ticketBuyerService } = this.props;
    const { currentStakePoolConfig, currentStakePoolConfigRequest, currentStakePoolConfigError, activeStakePoolConfig } = this.props;
    const { currentStakePoolConfigSuccessMessage, balances, purchaseTicketsRequestAttempt } = this.props;
    const { purchaseTicketsError, purchaseTicketsSuccess } = this.props;
    const { revokeTicketsError, revokeTicketsSuccess } = this.props;
    const { importScriptError, importScriptSuccess } = this.props;
    const { network, requiredStakepoolAPIVersion } = this.props;
    const { getTicketPriceResponse } = this.props;
    const { getStakeInfoResponse } = this.props;
    const { getAgendasResponse } = this.props;
    const { startAutoBuyerSuccess, startAutoBuyerResponse, stopAutoBuyerSuccess, startAutoBuyerError, stopAutoBuyerError } = this.props;
    const { getTicketBuyerConfigResponse } = this.props;
    var unitLabel = currentSettings.currencyDisplay;
    var unitDivisor = 1;
    if (unitLabel == 'DCR') {
      unitDivisor = 100000000;
    }
    var unconfigedStakePools = 0;
    if (currentStakePoolConfig != null) {
      for (var i = 0; i < currentStakePoolConfig.length; i++) {
        if (!currentStakePoolConfig[i].ApiKey && currentStakePoolConfig[i].Network == network) {
          unconfigedStakePools++;
        }
      }
    }
    var selectAccounts = (
      <div style={StakePoolStyles.selectStakePoolArea}>
        <select
          defaultValue={0}
          style={StakePoolStyles.selectPurchaseTickets}
          onChange={(e) =>{this.updateAccountNumber(e.target.value);}}
          >
          {balances !== null ?
            balances.map((account) => {
              if (account.accountName !== 'imported' && !account.hidden) {
                return (
                  <option style={StakePoolStyles.selectPurchaseTicketsN} key={account.accountNumber} value={account.accountNumber}>
                    {account.accountName}: {account.spendable / unitDivisor} {unitLabel}
                  </option>
                );
              }
            }):
            null
          }
        </select>
      </div>);
    var selectStakePoolApiKey = (
      <div style={StakePoolStyles.selectStakePoolArea}>
        <select
          defaultValue={0}
          style={StakePoolStyles.selectStakePool}
          onChange={(e) =>{this.updateStakePoolHost(e.target.value);}}
          >
          {currentStakePoolConfig !== null  ?
            currentStakePoolConfig.map((stakePool) => {
              if (!stakePool.ApiKey && stakePool.Network == network) {
                return (
                  <option style={StakePoolStyles.selectStakePoolN} key={stakePool.Host} value={stakePool.Host}>
                    {stakePool.Host}
                  </option>
                );
              }
            }) :
            null
          }
        </select>
      </div>);
    var selectStakePoolPurchaseTickets = (
      <div style={StakePoolStyles.selectStakePoolArea}>
        <select
          defaultValue={this.state.selectedStakePoolForPurchase !== null ? this.state.selectedStakePoolForPurchase.Host : 0}
          style={StakePoolStyles.selectPurchaseTickets}
          onChange={(e) =>{this.updateStakePoolPurchaseTickets(e.target.value);}}
          >
          {currentStakePoolConfig !== null  ?
            currentStakePoolConfig.map((stakePool) => {
              if (stakePool.ApiKey && stakePool.Network == network) {
                return (
                  <option style={StakePoolStyles.selectPurchaseTicketsN} key={stakePool.Host} value={stakePool.Host}>
                    {stakePool.Host}
                  </option>
                );
              }
            }) :
            null
          }
        </select>
      </div>);

    var selectStakePoolVotingPreferences = (
        <select
          defaultValue={this.state.selectedStakePoolForVoting !== null ? this.state.selectedStakePoolForPurchase.Host : 0}
          style={StakePoolStyles.selectVotingPreferences}
          onChange={(e) =>{this.updateStakePoolVotingPreferences(e.target.value);}}
          >
          {currentStakePoolConfig !== null  ?
            currentStakePoolConfig.map((stakePool) => {
              if (stakePool.ApiKey && stakePool.Network == network) {
                return (
                  <option style={StakePoolStyles.selectPurchaseTicketsN} key={stakePool.Host} value={stakePool.Host}>
                    {stakePool.Host}
                  </option>
                );
              }
            }) :
            null
          }
        </select>);
    var selectNumTickets = (
      <NumTicketsInput numTickets={this.state.numTickets} incrementNumTickets={()=>this.incrementNumTickets()} decrementNumTickets={()=>this.decrementNumTickets()}/>);
    var apiKeyDescription = (
      <div>
      </div>
    );
    var apiKeyHeading = 'Enter private passphrase to connect to your stakepool';
    var apiKeyFunc = (privPass) => this.setStakePoolInfo(privPass);
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
                {selectStakePoolApiKey}
              <div style={StakePoolStyles.contentNestFromAddressWalletIcon}></div>
            </div>
            <div style={StakePoolStyles.contentNestApiKeyInstructions}>
              <span>
                Please select your desired stakepool from the above dropdown and follow these instructions:
                <br/>1) Create an account or login to your existing account at <a style={StakePoolStyles.stakepoolLink} onClick={function(x){shell.openExternal(x);}.bind(null, this.state.stakePoolHost)}>{this.state.stakePoolHost}</a>.
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
          <KeyBlueButton style={StakePoolStyles.contentSend} disabled={this.state.apiKey == ''} onClick={this.state.apiKey == '' ? null : () => this.showPassphraseModal(apiKeyHeading, apiKeyDescription, apiKeyFunc)}>
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
          <div style={StakePoolStyles.votingTitleAreaName}>Voting Preferences {selectStakePoolVotingPreferences}</div>
        </div>
        {this.state.selectedStakePoolForVoting !== null && this.state.selectedStakePoolForVoting.APIVersionsSupported[1] == requiredStakepoolAPIVersion ?
        <div style={StakePoolStyles.votingAgendaArea}>
          {this.state.agendaDisplay !== null && this.state.selectedStakePoolForVoting !== null ?
            <AgendaOverview agenda={this.state.agendaDisplay} selectedChoice={this.state.selectedChoice} closeCurrentAgenda={() => this.closeCurrentAgenda()} selectAgendaChoice={() => this.selectAgendaChoice()} updatePreferences={(agendaId, choiceId) =>this.props.setVoteChoicesAttempt(this.state.selectedStakePoolForVoting, agendaId, choiceId)}/>:
            <div></div>
          }
          {getAgendasResponse !== null && this.state.selectedStakePoolForVoting !== null ? getAgendasResponse.getAgendasList().length > 0 ?
            getAgendasResponse.getAgendasList().map((agenda) => {
              var selectedChoice = 'abstain';
              if (this.state.selectedStakePoolForVoting.VoteChoices !== undefined) {
                for (var i = 0; i < this.state.selectedStakePoolForVoting.VoteChoices.length; i++) {
                  if (this.state.selectedStakePoolForVoting.VoteChoices[i] !== undefined &&
                  this.state.selectedStakePoolForVoting.VoteChoices[i].agendaId == agenda.getId()) {
                    selectedChoice = this.state.selectedStakePoolForVoting.VoteChoices[i].choiceId;
                    break;
                  }
                }
              }
              return(<AgendaCard key={agenda.getId()} agenda={agenda} selectedChoice={selectedChoice} onClick={() => this.showAgendaOverview(agenda)}/>);
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
            {currentStakePoolConfig.map((stakePool) => {
              if (stakePool.ApiKey && stakePool.Network == network) {
                return(
                <div key={stakePool.Host} style={StakePoolStyles.contentNestStakePool}>
                  <div style={StakePoolStyles.contentNestStakePoolSettings}>
                    <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>URL:</div>
                    <div style={StakePoolStyles.contentNestContentStakePoolSettings}>
                      {stakePool.Host}
                    </div>
                  </div>
                  <div style={StakePoolStyles.contentNestStakePoolSettings}>
                    <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>Ticket Address:</div>
                    <div style={StakePoolStyles.contentNestContentStakePoolSettings}>
                      {stakePool.TicketAddress}
                    </div>
                  </div>
                  <div style={StakePoolStyles.contentNestStakePoolSettings}>
                    <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>Script:</div>
                    <textarea disabled value={stakePool.Script} style={StakePoolStyles.contentNestContentStakePoolSettings}/>
                  </div>
                  <div style={StakePoolStyles.contentNestStakePoolSettingsBottom}>
                    <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>Pool Fees:</div>
                    <div style={StakePoolStyles.contentNestContentStakePoolSettings}>
                      {stakePool.PoolFees}
                    </div>
                  </div>
                </div>);
              }
            })}
            </div>
          </div>
          {unconfigedStakePools > 0 ?
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
    var startAutoBuyerHeading = 'Enter Passphrase to Start Autobuyer';
    var startAutoBuyerFunc = (privPass) => this.submitStart(privPass);
    var revokeTicketDescription = (
      <div>
      </div>
    );
    var revokeTicketHeading = 'Enter Passphrase to Revoke Tickets';
    var revokeTicketFunc = (privPass) => this.submitRevoke(privPass);
    var purchaseTicketDescription = (
      <div>
      </div>
    );
    var purchaseTicketHeading = 'Enter Passphrase to Purchase Tickets';
    var purchaseTicketFunc = (privPass) => this.submitPurchase(privPass);
    var importScriptDescription = (
      <div>
        Please enter your Script from your configured stakepool:
      </div>
    );
    var importScriptHeading = 'Enter Passphrase to Import Script';
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
          <div style={StakePoolStyles.votingTitleArea}>
            <div style={StakePoolStyles.votingTitleAreaName}>Purchase Tickets</div>
          </div>
          <div style={this.state.advancedHidden ? StakePoolStyles.flexHeightHidden : StakePoolStyles.flexHeightShown }>
            <div style={StakePoolStyles.purchaseTicketRow}>
              <div style={StakePoolStyles.purchaseTicketLabel}>Account:</div>
              <div style={StakePoolStyles.purchaseTicketInput}>
                {selectAccounts}
              </div>
              <div style={StakePoolStyles.purchaseTicketInputError}>
                <PurchaseTicketsInfoButton onClick={() => this.showPurchaseInfoModal()}/>
                <TicketsCogs opened={this.state.advancedHidden} onClick={this.state.advancedHidden ? () => this.showAdvanced() : () => this.hideAdvanced()}/>
              </div>
            </div>
            <div style={StakePoolStyles.purchaseTicketRow}>
              <div style={StakePoolStyles.purchaseTicketLabel}>Number of Tickets:</div>
              <div style={StakePoolStyles.purchaseTicketInput}>
                {selectNumTickets}
              </div>
              <div style={StakePoolStyles.purchaseTicketInputError}>
                {this.state.numTicketsError}
              </div>
            </div>
            <div style={StakePoolStyles.purchaseTicketRow}>
              <div style={StakePoolStyles.purchaseTicketLabel}>Ticket Fee (DCR/kB):</div>
              <div style={StakePoolStyles.purchaseTicketInput}>
                <div style={StakePoolStyles.inputFormPurchaseTicket}>
                  <input
                    type="text"
                    style={StakePoolStyles.contentNestPurchaseTicketForm}
                    placeholder="Ticket Fee"
                    defaultValue={0.01}
                    onBlur={(e) =>{this.updateTicketFee(e.target.value);}}/>
                </div>
              </div>
              <div style={StakePoolStyles.purchaseTicketInputError}>
                {this.state.ticketFeeError}
              </div>
            </div>
            <div style={StakePoolStyles.purchaseTicketRow}>
              <div style={StakePoolStyles.purchaseTicketLabel}>
                Stake Pool:
                </div>
              <div style={StakePoolStyles.purchaseTicketInput}>
                {selectStakePoolPurchaseTickets}
              </div>
              <div style={StakePoolStyles.purchaseTicketInputError}>
                <ManagePoolsButton onClick={() => this.showStakePoolConfig()}/>
              </div>
            </div>
            <div hidden={this.state.advancedHidden ? true : false}>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Tx Fee (DCR/kB):</div>
                <div style={StakePoolStyles.purchaseTicketInput}>
                  <div style={StakePoolStyles.inputFormPurchaseTicket}>
                    <input
                      type="text"
                      style={StakePoolStyles.contentNestPurchaseTicketForm}
                      placeholder="Tx Fee"
                      defaultValue={0.01}
                      onBlur={(e) =>{this.updateTxFee(e.target.value);}}/>
                  </div>
                </div>
                <div style={StakePoolStyles.purchaseTicketInputError}>
                  {this.state.txFeeError}
                </div>
              </div>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Expiry:</div>
                <div style={StakePoolStyles.purchaseTicketInput}>
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
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Pool Address:</div>
                <div style={StakePoolStyles.purchaseTicketInput}>
                  <div style={StakePoolStyles.inputFormPurchaseTicket}>
                    <input
                      disabled
                      type="text"
                      style={StakePoolStyles.contentNestPurchaseTicketForm}
                      value={this.state.selectedStakePoolForPurchase != null ? this.state.selectedStakePoolForPurchase.PoolAddress : null}/>
                  </div>
                </div>
              </div>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Pool Fees:</div>
                <div style={StakePoolStyles.purchaseTicketInput}>
                  <div style={StakePoolStyles.inputFormPurchaseTicket}>
                    <input
                      disabled
                      type="text"
                      style={StakePoolStyles.contentNestPurchaseTicketForm}
                      value={this.state.selectedStakePoolForPurchase != null ? this.state.selectedStakePoolForPurchase.PoolFees : null}/>
                  </div>
                </div>
              </div>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Ticket Address:</div>
                <div style={StakePoolStyles.purchaseTicketInput}>
                  <div style={StakePoolStyles.inputFormPurchaseTicket}>
                    <input
                      type="text"
                      disabled
                      style={StakePoolStyles.contentNestPurchaseTicketForm}
                      value={this.state.selectedStakePoolForPurchase != null ? this.state.selectedStakePoolForPurchase.TicketAddress : null}/>
                  </div>
                </div>
              </div>
            </div>
            <div hidden={this.state.advancedHidden ? false : true} style={StakePoolStyles.purchaseTicketQuickBarRow}>
              <div style={StakePoolStyles.quickBarRowLabel}>Settings:</div>
             <div style={StakePoolStyles.stakepoolIcon}>{this.state.selectedStakePoolForPurchase != null ? this.state.selectedStakePoolForPurchase.Host : null}</div>
              <div style={StakePoolStyles.expiryIcon}>{this.state.expiry} Blocks</div>
              <div style={StakePoolStyles.feeIcon}>{this.state.txFee} DCR/KB</div>
              <div style={StakePoolStyles.ticketAddressIcon}>{this.state.selectedStakePoolForPurchase != null ? this.state.selectedStakePoolForPurchase.TicketAddress : null}</div>
              <div style={StakePoolStyles.feeAddressIcon}>{this.state.selectedStakePoolForPurchase != null ? this.state.selectedStakePoolForPurchase.PoolAddress : null}</div>
              <div style={StakePoolStyles.poolFeeIcon}>{this.state.selectedStakePoolForPurchase != null ? this.state.selectedStakePoolForPurchase.PoolFees : null}%</div>
            </div>
          </div>
          <div>
            <KeyBlueButton style={StakePoolStyles.contentPurchaseButton} disabled={getTicketPriceResponse !== null ? this.state.spendLimit < getTicketPriceResponse.getTicketPrice() || this.state.numTickets <= 0: true} onClick={getTicketPriceResponse !== null ? this.state.spendLimit < getTicketPriceResponse.getTicketPrice() || this.state.numTickets <= 0 ? null : () => this.showPassphraseModal(purchaseTicketHeading, purchaseTicketDescription, purchaseTicketFunc) : null}>
              Purchase
            </KeyBlueButton>
            {getTicketPriceResponse !== null && this.state.spendLimit < getTicketPriceResponse.getTicketPrice() ?
            <span style={{color: 'red', float: 'left', paddingLeft: '20px', paddingTop: '19px'}}>
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
              <div style={StakePoolStyles.autoBuyerSwitch}>
                <AutoBuyerSwitch enabled={startAutoBuyerResponse} onClick={startAutoBuyerResponse ? ()=>this.disableTicketBuyer() : ()=>this.showPassphraseModal(startAutoBuyerHeading, startAutoBuyerDescription, startAutoBuyerFunc)}/>
              </div>
              <div style={StakePoolStyles.autoBuyerLabel}>{startAutoBuyerResponse ? 'Enabled' : 'Disabled'}</div>
              <div style={StakePoolStyles.autoBuyerQuickBarRow}>
                {this.state.autoBuyerHidden ?
                  <div>
                    <div style={StakePoolStyles.balanceToMaintainIcon}>{this.state.balanceToMaintain}</div>
                    <div style={StakePoolStyles.maxFeeIcon}>{this.state.maxFee} DCR</div>
                    <div style={StakePoolStyles.maxPriceAbsoluteIcon}>{this.state.maxPriceAbsolute} DCR</div>
                    <div style={StakePoolStyles.maxPriceRelativeIcon}>{this.state.maxPriceRelative}%</div>
                    <div style={StakePoolStyles.maxPerBlockIcon}>{this.state.maxPerBlock}</div>
                  </div>:
                  <div></div>}
              </div>
              <div style={StakePoolStyles.autoBuyerShowAdvancedArea}>
                <TicketsCogs opened={this.state.autoBuyerHidden} onClick={this.state.autoBuyerHidden ? () => this.showAutoBuyer() : () => this.hideAutoBuyer()}/>
              </div>
            </div>
            <div hidden={this.state.autoBuyerHidden ? true : false}>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Balance to maintain:</div>
                <div style={StakePoolStyles.purchaseTicketInput}>
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
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Max Fee:</div>
                <div style={StakePoolStyles.purchaseTicketInput}>
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
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Max Price Absolute:</div>
                <div style={StakePoolStyles.purchaseTicketInput}>
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
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Max Price eRelative:</div>
                <div style={StakePoolStyles.purchaseTicketInput}>
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
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Max per block:</div>
                <div style={StakePoolStyles.purchaseTicketInput}>
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
            currentStakePoolConfigSuccessMessage !== undefined && currentStakePoolConfigSuccessMessage !== '' ?
            <div key="configSuccess"  style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStakePoolConfigSuccess()}/>{currentStakePoolConfigSuccessMessage}</div> :
            <div key="configSuccess" ></div>,
            purchaseTicketsError !== null ?
            <div key="purchaseTicketsError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearPurchaseTicketsError()}/>{purchaseTicketsError}</div> :
            <div key="purchaseTicketsError" ></div>,
            purchaseTicketsSuccess !== undefined && purchaseTicketsSuccess !== '' ?
            <div key="purchaseTicketsSuccess" style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearPurchaseTicketsSuccess()}/>{purchaseTicketsSuccess}</div> :
            <div key="purchaseTicketsSuccess" ></div>,
            revokeTicketsError !== null ?
            <div key="revokeTicketsError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearRevokeTicketsError()}/>{revokeTicketsError}</div> :
            <div key="revokeTicketsError" ></div>,
            revokeTicketsSuccess !== undefined && revokeTicketsSuccess !== '' ?
            <div key="revokeTicketsSuccess" style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearRevokeTicketsSuccess()}/>{revokeTicketsSuccess}</div> :
            <div key="revokeTicketsSuccess" ></div>,
            startAutoBuyerSuccess !== null && startAutoBuyerSuccess !== '' ?
            <div key="startAutoBuyerSuccess" style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStartAutoBuyerSuccess()}/>{startAutoBuyerSuccess}</div> :
            <div key="startAutoBuyerSuccess" ></div>,
            stopAutoBuyerSuccess !== null && stopAutoBuyerSuccess !== '' ?
            <div key="stopAutoBuyerSuccess" style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStopAutoBuyerSuccess()}/>{stopAutoBuyerSuccess}</div> :
            <div key="stopAutoBuyerSuccess" ></div>,
            startAutoBuyerError !== null && startAutoBuyerError !== '' ?
            <div key="startAutoBuyerError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStartAutoBuyerError()}/>{startAutoBuyerError}</div> :
            <div key="startAutoBuyerError" ></div>,
            stopAutoBuyerError !== null && stopAutoBuyerError !== '' ?
            <div key="stopAutoBuyerError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStopAutoBuyerError()}/>{stopAutoBuyerError}</div> :
            <div key="stopAutoBuyerError" ></div>,
            importScriptError !== null ?
            <div key="importScriptError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearImportScriptError()}/>{importScriptError}</div> :
            <div key="importScriptError" ></div>,
            importScriptSuccess !== undefined && importScriptSuccess !== '' ?
            <div key="importScriptSuccess" style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearImportScriptSuccess()}/>{importScriptSuccess}</div> :
            <div key="importScriptSuccess" ></div>,
          ]
          }
          headerTitleOverview={
            <div style={{height: '100%'}}>
              <div style={{float: 'left'}}>{this.state.purchaseTickets ? activeStakePoolConfig ? 'Ticket price:' : '' : 'Stake pool settings'}</div>
                {getStakeInfoResponse !== null ?
                <div style={StakePoolStyles.stakeInfoArea}>
                  <div style={StakePoolStyles.stakeInfoAreaLeft}>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsLeftName}>Poolsize:</span><span style={StakePoolStyles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getPoolSize()}</span></div>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsLeftName}>All Mempool Tickets:</span><span style={StakePoolStyles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getAllMempoolTix()}</span></div>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsLeftName}>Own Mempool Tickets:</span><span style={StakePoolStyles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getOwnMempoolTix()}</span></div>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsLeftName}>Immature Tickets:</span><span style={StakePoolStyles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getImmature()}</span></div>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsLeftName}>Live Tickets:</span><span style={StakePoolStyles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getLive()}</span></div>
                  </div>
                  <div style={StakePoolStyles.stakeInfoAreaRight}>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsRightName}>Voted Tickets:</span><span style={StakePoolStyles.stakeInfoRowsRightValue}>{getStakeInfoResponse.getVoted()}</span></div>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsRightName}>Missed Tickets:</span><span style={StakePoolStyles.stakeInfoRowsRightValue}>{getStakeInfoResponse.getMissed()}</span></div>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsRightName}>Revoked Tickets:</span><span style={StakePoolStyles.stakeInfoRowsRightValue}>{getStakeInfoResponse.getRevoked()}</span></div>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsRightName}>Expired Tickets:</span><span style={StakePoolStyles.stakeInfoRowsRightValue}>{getStakeInfoResponse.getExpired()}</span></div>
                  </div>
                </div>:
                <div>
                </div>
                }

            </div>
          }
          headerMetaOverview={
            activeStakePoolConfig && !this.state.addAnotherStakePool && getTicketPriceResponse !== null ?
            <div>
             <Balance amount={getTicketPriceResponse.getTicketPrice()}/>
              <div style={StakePoolStyles.toggle}>
                <NewExistingSeedToggle
                  activeButton={'left'}
                  leftText={'Purchase Tickets'}
                  rightText={'Vote settings'}
                  toggleAction={(e)=>{this.toggleTicketStakePool(e);}}/>
              </div></div>:
            <div></div>

          }
        />
        {(!activeStakePoolConfig || this.state.addAnotherStakePool) && !currentStakePoolConfigRequest ?
          stakePoolConfigInput :
          currentStakePoolConfigRequest || purchaseTicketsRequestAttempt ?
            <CircularProgress style={StakePoolStyles.loading} size={125} thickness={6}/> :
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
        </div>);
    }
  }
}

export default StakePool;
