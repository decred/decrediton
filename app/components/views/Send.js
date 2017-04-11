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

    this.state = {
      privpass: '',
      rawTx: '',
      account: 0,
      confirmations: 0,
      outputs: [{key:0, destination: '', amount: ''}],
      outputErrors: [{key:0, addressError: null, amountError: null}],
    };
  }
  componentWillMount() {
    this.props.clearConstructTxError();
    this.props.clearPublishTxError();
    this.props.clearSignTxError();
    this.props.clearPublishTxSuccess();
  }

  clearTransactionData() {
    this.setState({account:0, confirmations: 0, outputs: [{key:0, destination: '', amount: ''}]});
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
    var updatedOutputErrors = this.state.outputErrors;
    for (var i = 0; i < this.state.outputs.length; i++ ) {
      if (this.state.outputs[i].address == '') {
        updatedOutputErrors[i].addressError = '*Please enter a valid address';
        checkErrors = true;
      }
      if (this.state.outputs[i].amount < 0 ) {
        updatedOutputErrors[i].amountError = '*Please enter a valid amount (> 0)';
        checkErrors = true;
      }
    }
    for (var j = 0; j < this.state.outputErrors.length; j++ ) {
      if (this.state.outputErrors[j].addressError !== null || this.state.outputErrors[j].amountError !== null ) {
        checkErrors = true;
      }
    }
    if (checkErrors) {
      this.setState({outputErrors: updatedOutputErrors});
      return;
    }
    this.props.constructTransactionAttempt(this.state.account, this.state.confirmations, this.state.outputs);
  }
  appendOutput() {
    var newOutput = {key:`${this.state.outputs.length}`, destination: '', amount: ''};
    var newOutputError = {key:`${this.state.outputs.length}`, addressError: null, amountError: null};
    this.setState({ outputs: this.state.outputs.concat([newOutput]), outputErrors: this.state.outputErrors.concat([newOutputError])});
  }
  removeOutput(outputKey) {
    var updateOutputs = this.state.outputs.filter(output => {
      return (output.key != outputKey);
    });
    var updateOutputErrors = this.state.outputErrors.filter(outputError => {
      return (outputError.key != outputKey);
    });
    this.setState({ outputs: updateOutputs, outputErrors: updateOutputErrors });
  }
  updateOutputDestination(outputKey, dest) {
    var updateOutputs = this.state.outputs;
    updateOutputs[outputKey].destination = dest;
    this.setState({ outputs: updateOutputs });
  }
  updateAccountNumber(accountNum) {
    this.setState({account: accountNum});
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
    updateOutputs[outputKey].amount = amount * units;
    this.setState({ outputs: updateOutputs });
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
    const { getAccountsResponse } = this.props;
    const { getNetworkResponse } = this.props;

    var unitLabel = currentSettings.currencyDisplay;

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
          constructTxError !== null ?
            <div key="conError"  style={SendStyles.viewNotificationError}><div style={SendStyles.sendAddressDeleteIconHeader} onClick={() => this.props.clearConstructTxError()}/>{constructTxError}</div> :
            <div key="conError" ></div>,
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
      estimatedFee = (constructTxResponse.getEstimatedSignedSize() / 1000) * 0.01 * 100000000; // convert to atoms for balance div
      totalSpent = constructTxResponse.getTotalPreviousOutputAmount() - constructTxResponse.getTotalOutputAmount() + constructTxResponse.totalAmount;
    }
    const signTxView = (
      <div style={SendStyles.view}>
        {sharedHeader}
        <div style={SendStyles.content}>
          <div style={SendStyles.flexHeight}>
            <div style={SendStyles.sendFromAddress}>
              <div style={SendStyles.sendPrefixConfirm}>Confirm transaction:</div>
            </div>
            <div style={SendStyles.sendToAddress} key="totalSpent">
              <div style={SendStyles.sendPrefixConfirm}>Total spent from wallet:</div>
              <div style={SendStyles.sendAddressHashBlockConfirm}>
                <Balance amount={totalSpent} />
              </div>
            </div>
            <div style={SendStyles.sendToAddress} key="estimatedSize">
              <div style={SendStyles.sendPrefixConfirm}>Estimated Transactions Size:</div>
              <div style={SendStyles.sendAddressHashBlockConfirm}>
                {constructTxResponse !== null ? constructTxResponse.getEstimatedSignedSize() : null} bytes
              </div>
            </div>
            <div style={SendStyles.sendToAddress} key="totalFee">
              <div style={SendStyles.sendPrefixConfirm}>Estimated Fee:</div>
              <div style={SendStyles.sendAddressHashBlockConfirm}>
                <Balance amount={estimatedFee} />
              </div>
            </div>
            <div style={SendStyles.sendToAddress} key="privatePassPhrase">
              <div style={SendStyles.sendPrefixConfirm}>Private Passhrase:</div>
              <div style={SendStyles.sendAddressHashBlock}>
                <div style={SendStyles.inputForm}>
                  <input
                    id="privpass"
                    style={SendStyles.sendAddressHashTo}
                    type="password"
                    placeholder="Private Password"
                    onBlur={(e) =>this.updatePrivPass(e.target.value)}/>
                </div>
              </div>
            </div>
          </div>
          <KeyBlueButton style={SendStyles.contentSend} onClick={() => this.submitSignPublishTx()}>
            Confirm
          </KeyBlueButton>
          <SlateGrayButton style={SendStyles.contentSend} onClick={() => this.clearTransactionData()}>
            Cancel
          </SlateGrayButton>
        </div>
      </div>);

    var selectAccounts = (
      <div style={SendStyles.selectAccountsSend}>
        <select
          defaultValue={this.state.account}
          style={SendStyles.selectAccount}
          onChange={(e) =>{this.updateAccountNumber(e.target.value);}}
          >
          {getAccountsResponse !== null ?
            getAccountsResponse.getAccountsList().map((account) => {
              if (account.getAccountName() !== 'imported') {
                return (
                  <option style={SendStyles.selectAccountNFirst} key={account.getAccountNumber()} value={account.getAccountNumber()}>
                    {account.getAccountName()}
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
            <KeyBlueButton style={SendStyles.contentSend} onClick={() => this.submitConstructTx()}>
              Send
            </KeyBlueButton>
          </div>
        </div>
    );

    if (constructTxResponse !== null) {
      sendView = signTxView;
    }
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
