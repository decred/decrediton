// @flow
import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorScreen from '../ErrorScreen';
import Balance from '../Balance';
import SideBar from '../SideBar';
import Header from '../Header';
import NewExistingSeedToggle from '../NewExistingSeedToggle';
import KeyBlueButton from '../KeyBlueButton';
import HideShowButton from '../HideShowButton';
import { StakePoolStyles } from './ViewStyles';

class StakePool extends Component{
  static propTypes = {
    walletService: PropTypes.object,
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
    this.state = {
      stakePoolHost: initStakePoolHost,
      apiKey: '',
      account: 0,
      addAnotherStakePool: false,
      purchaseTickets: true,
      spendLimit: this.props.getBalanceResponse != null ? this.props.getBalanceResponse.getSpendable() : 0,
      conf: 0,
      numTickets: 0,
      expiry: 0,
      txFee: 0.01, // DCR/kB
      ticketFee: 0.01, // DCR/kB
      selectedStakePoolForPurchase: initStakePool,
      advancedHidden: true,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.currentStakePoolConfig != nextProps.currentStakePoolConfig) {
      for (var j = 0; j < nextProps.currentStakePoolConfig.length; j++) {
        if (nextProps.currentStakePoolConfig[j].ApiKey && nextProps.currentStakePoolConfig[j].Network == this.props.network) {
          this.setState({selectedStakePoolForPurchase: nextProps.currentStakePoolConfig[j]});
          break;
        }
      }
    }
  }
  componentWillMount() {
    this.props.clearStakePoolConfigError();
    this.props.clearStakePoolConfigSuccess();
    this.props.clearPurchaseTicketsSuccess();
    this.props.clearPurchaseTicketsError();
  }
  submitPurchase() {
    if (this.state.privpass == null || this.state.selectedStakePoolForPurchase == null ||
       this.state.numTickets <= 0 ) {
      return;
    }
    this.props.purchaseTicketsAttempt(
      this.state.privpass,
      this.state.account,
      this.state.spendLimit,
      this.state.conf,
      this.state.numTickets,
      this.state.expiry,
      this.state.ticketFee,
      this.state.selectedStakePoolForPurchase
    );
  }
  updateAccountNumber(accountNum) {
    this.setState({account: accountNum});
  }
  updateNumTickets(numTickets) {
    this.setState({numTickets: numTickets});
  }
  updateTicketFee(ticketFee) {
    this.setState({ticketFee: ticketFee});
  }
  addAnotherStakePool() {
    this.setState({addAnotherStakePool: true});
  }
  setStakePoolInfo() {
    if (this.state.stakePoolHost == '' || this.state.apiKey == '') {
      return;
    }
    this.props.setStakePoolInformation(this.state.stakePoolHost, this.state.apiKey, 0);
    setTimeout(this.setState({addAnotherStakePool: false}), 1000);
  }
  updateApiKey(apiKey) {
    this.setState({apiKey: apiKey});
  }
  updateStakePoolHost(poolHost) {
    this.setState({stakePoolHost: poolHost});
  }
  toggleTicketStakePool(side) {
    if (side == 'right') {
      this.setState({purchaseTickets: false});
    } else if (side == 'left') {
      this.setState({purchaseTickets: true});
    }
  }
  showAdvanced() {
    this.setState({advancedHidden: false});
  }
  hideAdvanced() {
    this.setState({advancedHidden: true});
  }

  render() {
    const { walletService } = this.props;
    const { currentStakePoolConfig, currentStakePoolConfigRequest, currentStakePoolConfigError, activeStakePoolConfig } = this.props;
    const { currentStakePoolConfigSuccessMessage, getAccountsResponse, purchaseTicketsRequestAttempt } = this.props;
    const { purchaseTicketsError, purchaseTicketsSuccess } = this.props;
    const { network } = this.props;
    const { getTicketPriceResponse } = this.props;
    const { getStakeInfoResponse } = this.props;

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
          {getAccountsResponse !== null ?
            getAccountsResponse.getAccountsList().map((account) => {
              if (account.getAccountName() !== 'imported') {
                return (
                  <option style={StakePoolStyles.selectPurchaseTicketsN} key={account.getAccountNumber()} value={account.getAccountNumber()}>
                    {account.getAccountName()}
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
          defaultValue={this.state.selectedStakePoolForPurchase}
          style={StakePoolStyles.selectPurchaseTickets}
          onChange={(e) =>{this.updateStakePoolPurchaseTickets(e.target.value);}}
          >
          {currentStakePoolConfig !== null  ?
            currentStakePoolConfig.map((stakePool) => {
              if (stakePool.ApiKey && stakePool.Network == network) {
                return (
                  <option style={StakePoolStyles.selectPurchaseTicketsN} key={stakePool.Host} value={stakePool}>
                    {stakePool.Host}
                  </option>
                );
              }
            }) :
            null
          }
        </select>
      </div>);
    var selectNumTickets = (
      <div style={StakePoolStyles.selectStakePoolArea}>
        <select
          defaultValue={0}
          style={StakePoolStyles.selectPurchaseTickets}
          onChange={(e) =>{this.updateNumTickets(e.target.value);}}
          >
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={0} label={0}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={1} label={1}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={2} label={2}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={3} label={3}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={4} label={4}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={5} label={5}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={6} label={6}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={7} label={7}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={8} label={8}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={9} label={9}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={10} label={10}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={11} label={11}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={12} label={12}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={13} label={13}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={14} label={14}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={15} label={15}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={16} label={16}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={17} label={17}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={18} label={18}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={19} label={19}/>
          <option style={StakePoolStyles.selectPurchaseTicketsN} value={20} label={20}/>
        </select>
      </div>);

    var stakePoolConfigInput = (
      <div style={StakePoolStyles.content}>
        <div style={StakePoolStyles.flexHeight}>
            <div style={StakePoolStyles.contentNestFromAddress}>
              <div style={StakePoolStyles.contentNestPrefixSend}>Stake Pool:</div>
                {selectStakePoolApiKey}
              <div style={StakePoolStyles.contentNestFromAddressWalletIcon}></div>
            </div>
            <div style={StakePoolStyles.contentNestToAddress}>
              <div style={StakePoolStyles.contentNestPrefixSend}>Api Key:</div>
              <div style={StakePoolStyles.contentNestAddressHashBlock}>
                <div style={StakePoolStyles.inputForm}>
                  <input
                    type="text"
                    style={StakePoolStyles.contentNestAddressAmountSum}
                    placeholder="API Key"
                    onBlur={(e) =>{this.updateApiKey(e.target.value);}}/>
                </div>
              </div>
            </div>
          </div>
          <KeyBlueButton style={StakePoolStyles.contentSend} onClick={() => this.setStakePoolInfo()}>
            Confirm
          </KeyBlueButton>
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
        </div>
    );
    var purchaseTicketsView = (
        <div style={StakePoolStyles.contentPurchaseTicketView}>
          <div style={StakePoolStyles.instructions}>
            In order to stake mine, you must make a deposit to the network in the form of a ticket.<br/>
            The ticket enters the owner in a lottery for the next several months, at which time it may 
            be chosen at any block for validation.  After being chosen randomly, the ticket owner must 
            produce a vote transaction to validate the previous block and vote on any agendas.  <b>Decrediton 
            does not vote</b> and tickets must only be purchased with voting rights assigned to a stake pool 
            or your own seperate, always running voting wallet.<br/>
            The safest way to ensure that your vote succeeds is to use a stake pool.
          </div>
          <div style={StakePoolStyles.flexHeight}>
            <div style={StakePoolStyles.purchaseTicketRow}>
              <div style={StakePoolStyles.purchaseTicketLabel}>Stake Pool:</div>
              <div style={StakePoolStyles.purchaseTicketInput}>
                {selectStakePoolPurchaseTickets}
              </div>
            </div>
            <div style={StakePoolStyles.purchaseTicketRow}>
              <div style={StakePoolStyles.purchaseTicketLabel}>Account:</div>
              <div style={StakePoolStyles.purchaseTicketInput}>
                {selectAccounts}
              </div>
            </div>
            <div style={StakePoolStyles.purchaseTicketRow}>
              <div style={StakePoolStyles.purchaseTicketLabel}>Number of Tickets:</div>
              <div style={StakePoolStyles.purchaseTicketInput}>
                {selectNumTickets}
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
              </div>
              <div style={StakePoolStyles.purchaseTicketRow}>
                <div style={StakePoolStyles.purchaseTicketLabel}>Expiry:</div>
                <div style={StakePoolStyles.purchaseTicketInput}>
                  <div style={StakePoolStyles.inputFormPurchaseTicket}>
                    <input
                      type="text"
                      style={StakePoolStyles.contentNestPurchaseTicketForm}
                      placeholder="Expiry"
                      defaultValue={0}
                      onBlur={(e) =>{this.updateExpiry(e.target.value);}}/>
                  </div>
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
            <div style={StakePoolStyles.purchaseTicketRow}>
              <HideShowButton showAdvanced={this.state.advancedHidden ? true : false} onClick={this.state.advancedHidden ? () => this.showAdvanced() : () => this.hideAdvanced()}>
                {this.state.advancedHidden ? 'Show' : 'Hide'} advanced
              </HideShowButton>
            </div>
            <div style={StakePoolStyles.purchaseTicketRow}>
              <div style={StakePoolStyles.purchaseTicketLabel}>Private Passhrase:</div>
              <div style={StakePoolStyles.purchaseTicketInput}>
                <div style={StakePoolStyles.inputFormPurchaseTicket}>
                  <input
                    id="privpass"
                    style={StakePoolStyles.contentNestPurchaseTicketForm}
                    type="password"
                    placeholder="Private Passphrase"
                    onBlur={(e) =>{this.setState({privpass: Buffer.from(e.target.value)});}}/>
                </div>
              </div>
            </div>
          </div>
          <KeyBlueButton style={StakePoolStyles.contentSend} onClick={() => this.submitPurchase()}>
            Purchase
          </KeyBlueButton>
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
          ]
          }
          headerTitleOverview={
            <div style={{height: '100%'}}>
              <div style={{float: 'left'}}>{this.state.purchaseTickets ? 'Ticket price:' :'Stake pool settings'}</div>
                {getStakeInfoResponse !== null ?
                <div style={StakePoolStyles.stakeInfoArea}>
                  <div style={StakePoolStyles.stakeInfoAreaLeft}>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsLeftName}>Poolsize:</span><span style={StakePoolStyles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getPoolSize()}</span></div>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsLeftName}>All Mempool Tickets:</span><span style={StakePoolStyles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getAllMempoolTix()}</span></div>
                    <div style={StakePoolStyles.stakeInfoRows}><span style={StakePoolStyles.stakeInfoRowsLeftName}>Own Mempool Tickets:</span><span style={StakePoolStyles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getOwnMempoolTix()}</span></div>
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
                  rightText={'Configure stakepools'}
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
              purchaseTicketsView :
              configuredStakePoolInformation
        }
      </div>
    );
    if (walletService === null) {
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
