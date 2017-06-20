// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ErrorScreen from '../ErrorScreen';
import CircularProgress from 'material-ui/CircularProgress';
import { reverseHash } from '../../helpers/byteActions';
import SideBar from '../SideBar';
import Balance from '../Balance';
import Header from '../Header';
import KeyBlueButton from '../KeyBlueButton';
import SlateGrayButton from '../SlateGrayButton';
import { SendStyles } from './ViewStyles';

function mapStateToProps(state) {
  return {
    currentSettings: state.settings.currentSettings,
  };
}

class Send extends Component{
  static propTypes = {
    walletService: PropTypes.object,

    constructTxResponse: PropTypes.object,
    constructTxRequestAttempt: PropTypes.bool.isRequired,

    publishTransactionResponse: PropTypes.object,
  }
  constructor(props) {
    super(props);

    var defaultSpendable = 0;
    if (this.props.balances != null) {
      for (var i = 0; i < this.props.balances.length; i++) {
        if (this.props.balances[i].accountNumber == 0) {
          defaultSpendable = this.props.balances[i].spendable;
        }
      }
    }
    this.state = {
      privpass: '',
      rawTx: '',
      account: 0,
      accountSpendable: defaultSpendable,
      confirmations: 0,
      outputs: [{key:0, destination: null, amount: null, addressError: null, amountError: null}],
      totalOutputAmount: 0,
      privPassError: null,
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
      this.setState({accountSpendable: newAccountSpendableBalance});
    }
  }
  componentWillMount() {
    this.props.clearConstructTxError();
    this.props.clearPublishTxError();
    this.props.clearSignTxError();
    this.props.clearPublishTxSuccess();
  }

  clearTransactionData() {
    this.setState({totalOutputAmount: 0, account: 0, confirmations: 0, outputs: [{key:0, destination: null, amount: null, addressError: null, amountError: null}]});
    this.props.clearTransaction();
  }
  submitSignPublishTx() {
    var checkErrors = false;
    if (this.state.privpass == null) {
      this.setState({privPassError: '*Please enter your private passphrase'});
      checkErrors = true;
    }
    if (this.state.privPassError !== null || this.props.constructTxResponse == null || checkErrors) {
      return;
    }
    this.props.signTransactionAttempt(this.state.privpass, this.props.constructTxResponse.getUnsignedTransaction());
    setTimeout(this.clearTransactionData(),1000);
  }
  submitConstructTx() {
    var checkErrors = false;
    var updatedOutputErrors = this.state.outputs;
    for (var i = 0; i < updatedOutputErrors.length; i++ ) {
      if (updatedOutputErrors[i].destination == null) {
        updatedOutputErrors[i].addressError = '*Please enter a valid address';
        checkErrors = true;
      }
      if (updatedOutputErrors[i].amount == null || updatedOutputErrors[i].amount < 0) {
        updatedOutputErrors[i].amountError = '*Please enter a valid amount (> 0)';
        checkErrors = true;
      }
      if (updatedOutputErrors[i].addressError !== null || updatedOutputErrors[i].amountError !== null ) {
        checkErrors = true;
      }
    }
    if (checkErrors) {
      this.setState({outputs: updatedOutputErrors});
      return;
    }
    this.props.constructTransactionAttempt(this.state.account, this.state.confirmations, this.state.outputs);
  }
  appendOutput() {
    var newOutput = {key:`${this.state.outputs.length}`, destination: null, amount: null, addressError: null, amountError: null};
    this.setState({ outputs: this.state.outputs.concat([newOutput])});
  }
  removeOutput(outputKey) {
    var updateOutputs = this.state.outputs.filter(output => {
      return (output.key != outputKey);
    });
    var totalOutputAmount = 0;
    for (var i = 0; i < updateOutputs.length; i++){
      totalOutputAmount += updateOutputs[i].amount;
    }
    this.setState({ totalOutputAmount: totalOutputAmount, outputs: updateOutputs});
  }
  updateOutputDestination(outputKey, dest) {
    // do some more helper address checking here
    // possibly check for Ds/Dc Ts/Tc and length at the least
    // later can do full address validtion from dcrutil code
    var updateOutputs = this.state.outputs;
    if (dest == '') {
      updateOutputs[outputKey].addressError = '*Please enter a valid address';
    } else {
      updateOutputs[outputKey].destination = dest;
      updateOutputs[outputKey].addressError = null;
    }
    this.setState({ outputs: updateOutputs });
    this.submitConstructTx();
  }
  updateAccountNumber(accountNum) {
    this.setState({account: accountNum});
    if (this.props.balances !== null) {
      var updatedAccountSpendable = 0;
      for (var i = 0; i < this.props.balances.length; i++) {
        if (this.props.balances[i].accountNumber == accountNum) {
          updatedAccountSpendable = this.props.balances[i].spendable;
          break;
        }
      }
      this.setState({accountSpendable: updatedAccountSpendable});
    }
    this.submitConstructTx();
  }
  updateOutputAmount(outputKey, amount, unitLabel) {
    // Default to DCR.
    var units = 100000000;
    if (unitLabel === 'DCR') {
      units = 100000000;
    }
    if (unitLabel === 'atoms') {
      units = 1;
    }
    var updateOutputs = this.state.outputs;
    if (amount < 0) {
      updateOutputs[outputKey].amountError = '*Please enter a valid amount (> 0)';
    } else {
      updateOutputs[outputKey].amount = amount * units;
      updateOutputs[outputKey].amountError = null;
    }
    var totalOutputAmount = 0;
    for (var i = 0; i < updateOutputs.length; i++){
      totalOutputAmount += updateOutputs[i].amount;
    }
    this.setState({ totalOutputAmount: totalOutputAmount, outputs: updateOutputs });
    this.submitConstructTx();
  }
  updatePrivPass(privpass) {
    if (privpass != '') {
      this.setState({privpass: Buffer.from(privpass), privPassError: null});
    } else {
      this.setState({privpass: null, privPassError: '*Please enter your private passphrase'});
    }
  }
  render() {
    const { currentSettings } = this.props;
    const { walletService } = this.props;
    const { constructTxResponse, constructTxError, constructTxRequestAttempt } = this.props;
    const { publishTransactionResponse, publishTransactionError, publishTransactionRequestAttempt } = this.props;
    const { signTransactionError, signTransactionRequestAttempt } = this.props;
    const { balances } = this.props;
    const { getNetworkResponse } = this.props;

    var unitLabel = currentSettings.currencyDisplay;
    var unitDivisor = 100000000;
    if (unitLabel == 'atoms') {
      unitDivisor = 1;
    }
    var networkTextDiv = (<div></div>);
    if (getNetworkResponse !== null) {
      if (getNetworkResponse.networkStr == 'testnet') {
        networkTextDiv = (<div style={SendStyles.headerMetaSend}>Testnet Decred addresses always begin with letter T contain 26-35 alphanumeric characters e.g. <span style={SendStyles.headerMetaSpanSend}>TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X</span>.</div>);
      } else if (getNetworkResponse.networkStr == 'mainnet') {
        networkTextDiv = (<div style={SendStyles.headerMetaSend}>Mainnet Decred addresses always begin with letter D contain 26-35 alphanumeric characters e.g. <span style={SendStyles.headerMetaSpanSend}>DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X</span>.</div>);
      }
    }
    var sharedHeader = (
      <Header
        headerTop={[publishTransactionError !== null ?
            <div key="pubError" style={SendStyles.viewNotificationError}><div style={SendStyles.sendAddressDeleteIconHeader} onClick={() => this.props.clearPublishTxError()}/>{publishTransactionError}</div> :
            <div key="pubError" ></div>,
          signTransactionError !== null ?
            <div key="signError"  style={SendStyles.viewNotificationError}><div style={SendStyles.sendAddressDeleteIconHeader} onClick={() => this.props.clearSignTxError()}/>{signTransactionError}</div> :
            <div key="signError" ></div>,
          publishTransactionResponse !== null ?
            <div key="pubSuccess"  style={SendStyles.viewNotificationSuccess}><div style={SendStyles.sendAddressDeleteIconHeader} onClick={() => this.props.clearPublishTxSuccess()}/>Published Tx: {reverseHash(publishTransactionResponse.toString('hex'))}</div> :
            <div key="pubSuccess" ></div>]}
        headerTitleOverview={<div style={SendStyles.headerTitleSend}>Send Funds</div>}
        headerMetaOverview={networkTextDiv}>
      </Header>
    );

    var estimatedFee = 0;
    var totalSpent = 0;
    if (constructTxResponse !== null) {
      // Use default fee per kb since we aren't setting currently in constructTxRequest (0.01 dcr)
      estimatedFee = (constructTxResponse.getEstimatedSignedSize() / 1000) * 0.001 * 100000000; // convert to atoms for balance div
      totalSpent = constructTxResponse.getTotalPreviousOutputAmount() - constructTxResponse.getTotalOutputAmount() + constructTxResponse.totalAmount;
    }

    var selectAccounts = (
      <div style={SendStyles.selectAccountsSend}>
        <select
          defaultValue={this.state.account}
          style={SendStyles.selectAccount}
          onChange={(e) =>{this.updateAccountNumber(e.target.value);}}
          >
          {balances !== null ?
            balances.map((account) => {
              if (account.accountName !== 'imported') {
                return (
                  <option style={SendStyles.selectAccountN} key={account.accountNumber} value={account.accountNumber}>
                    {account.accountName}: {account.spendable / 100000000}
                  </option>
                );
              }
            }):
            null
          }
        </select>
      </div>);

    var sendView = (
      <div style={SendStyles.view}>
        {sharedHeader}
        <div style={SendStyles.content}>
          <div style={SendStyles.sendSelectAccountArea}>
            <div style={SendStyles.sendLabel}>From:</div>
            <div style={SendStyles.sendSelectAccountInput}>
              {selectAccounts}
            </div>
            <div style={SendStyles.sendFromAddressWalletIcon}></div>
          </div>
          <div style={SendStyles.flexHeight}>
            <div id="dynamicInput">
            {this.state.outputs.map((output,i) => {
              if ( i == 0 ) {
                return(
                <div style={SendStyles.sendRow} key={output.key}>
                  <div style={SendStyles.sendOutputRow}>
                    <div style={SendStyles.sendLabel}>To:</div>
                    <div style={SendStyles.sendAddress}>
                      <div style={SendStyles.inputForm}>
                        <input
                          defaultValue={output.destination}
                          type="text"
                          style={SendStyles.sendAddressHashTo}
                          key={'destination'+output.key}
                          placeholder="Destination Address"
                          onBlur={(e) =>{this.updateOutputDestination(output.key, e.target.value);}}/>
                      </div>
                    </div>
                    <div style={SendStyles.sendAddressWalletIcon} onClick={() => this.appendOutput()}></div>
                    <div style={SendStyles.sendAmount}>
                      <div style={SendStyles.sendAmountLabel}>Amount:</div>
                      <div style={SendStyles.sendAddressAmountSumAndCurrency}>
                      <div style={SendStyles.sendAddressAmountSumGradient}>{unitLabel}</div>
                        <input
                          defaultValue={output.amount/unitDivisor}
                          type="text"
                          style={SendStyles.sendAddressInputAmount}
                          key={'amount'+output.key}
                          placeholder="Amount"
                          onBlur={(e) =>{this.updateOutputAmount(output.key, e.target.value, unitLabel);}}/>
                      </div>
                    </div>
                  </div>
                  <div style={SendStyles.sendOutputErrorRow}>
                    <div style={SendStyles.sendOutputAddressError}>
                      {output.addressError}
                    </div>
                    <div style={SendStyles.sendOutputAmountError}>
                      {output.amountError}
                    </div>
                  </div>
                </div>);
              } else {
                return(
                <div style={SendStyles.sendRow} key={output.key}>
                  <div style={SendStyles.sendOutputRow}>
                    <div style={SendStyles.sendAddressHashBlock}>
                      <div style={SendStyles.inputForm}>
                        <input
                          defaultValue={output.destination}
                          type="text"
                          style={SendStyles.sendAddressHashTo}
                          key={'destination'+output.key}
                          placeholder="Destination Address"
                          onBlur={(e) =>{this.updateOutputDestination(output.key, e.target.value);}}/>
                      </div>
                      <div style={SendStyles.sendGradient}></div>
                    </div>
                    {this.state.outputs.length - 1 === parseInt(output.key) ?
                      <div style={SendStyles.sendAddressDeleteIcon} onClick={() => this.removeOutput(output.key)}></div> :
                      <div style={{width:'39px', height: '34px', float: 'left'}}></div>
                    }
                    <div style={SendStyles.sendAmount}>
                      <div style={SendStyles.sendAddressAmountSumAndCurrency}>
                      <div style={SendStyles.sendAddressAmountSumGradient}>{unitLabel}</div>
                        <input
                          defaultValue={output.amount/unitDivisor}
                          type="text"
                          style={SendStyles.sendAddressInputAmount}
                          key={'amount'+output.key}
                          placeholder="Amount"
                          onBlur={(e) =>{this.updateOutputAmount(output.key, e.target.value, unitLabel);}}/>
                      </div>
                    </div>
                  </div>
                  <div style={SendStyles.sendOutputErrorRow}>
                    <div style={SendStyles.sendOutputAddressError}>
                      {output.addressError}
                    </div>
                    <div style={SendStyles.sendOutputAmountError}>
                      {output.amountError}
                    </div>
                  </div>
                </div>);
              }})}
              </div>
            </div>
            <div style={SendStyles.sendButtonArea}>
              <KeyBlueButton style={SendStyles.contentSend} disabled={this.state.accountSpendable < this.state.totalOutputAmount && this.state.totalOutputAmount > 0} onClick={this.state.accountSpendable < this.state.totalOutputAmount && this.state.totalOutputAmount > 0 ? null : () => this.submitConstructTx()}>
                Send
              </KeyBlueButton>
              {constructTxError !== null ?
              <span style={{color: 'red', width: '330px', float: 'left', paddingLeft: '20px', paddingTop: '30px'}}>
                {constructTxError}
              </span> :
              <div/>
              }
              <div style={SendStyles.estimationAreaSend}>
                <div style={SendStyles.totalAmountSend}>
                  <div style={SendStyles.totalAmountSendText}>
                    Total amount sending:
                  </div>
                  <div style={SendStyles.totalAmountSendAmount}>
                    <Balance amount={totalSpent}/>
                  </div>
                </div>
                <div style={SendStyles.totalAmountSend}>
                  <div style={SendStyles.totalAmountSendText}>
                    Estimated Fee:
                  </div>
                  <div style={SendStyles.totalAmountSendAmount}>
                    <Balance amount={estimatedFee} />
                  </div>
                </div>
                <div style={SendStyles.totalAmountSend}>
                  <div style={SendStyles.totalAmountSendText}>
                    Estimated Size:
                  </div>
                  <div style={SendStyles.totalAmountSendAmount}>
                    {constructTxResponse !== null ? constructTxResponse.getEstimatedSignedSize() : 0} bytes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
    var loadingView = (
      <div style={SendStyles.view}>
        {sharedHeader}
        <div style={SendStyles.content}>
          <CircularProgress style={SendStyles.loading} size={125} thickness={6}/>
        </div>
      </div>
    );
    if (signTransactionRequestAttempt || publishTransactionRequestAttempt || constructTxRequestAttempt ) {
      sendView = loadingView;
    }
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={SendStyles.body}>
          <SideBar />
          {sendView}
        </div>);
    }
  }
}

export default connect(mapStateToProps)(Send);
