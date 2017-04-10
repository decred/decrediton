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
      outputs: [{key:0, destination: '', amount: ''}] };
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
    if (this.state.privpass == '' || this.props.constructTxResponse === null) {
      return;
    }
    this.props.signTransactionAttempt(this.state.privpass, this.props.constructTxResponse.getUnsignedTransaction());
    setTimeout(this.clearTransactionData(),1000);
  }
  submitConstructTx() {
    if (this.state.outputs[0].destination == '' || this.state.outputs[0].amount == '') {
      return;
    }
    this.props.constructTransactionAttempt(this.state.account, this.state.confirmations, this.state.outputs);
  }
  appendOutput() {
    var newOutput = {key:`${this.state.outputs.length}`, destination: '', amount: ''};
    this.setState({ outputs: this.state.outputs.concat([newOutput]) });
  }
  removeOutput(outputKey) {
    var updateOutputs = this.state.outputs.filter(output => {
      return (output.key != outputKey);
    });
    this.setState({ outputs: updateOutputs });
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
            <div key="pubError" style={SendStyles.viewNotificationError}><div style={SendStyles.contentNestAddressDeleteIconHeader} onClick={() => this.props.clearPublishTxError()}/>{publishTransactionError}</div> :
            <div key="pubError" ></div>,
          constructTxError !== null ?
            <div key="conError"  style={SendStyles.viewNotificationError}><div style={SendStyles.contentNestAddressDeleteIconHeader} onClick={() => this.props.clearConstructTxError()}/>{constructTxError}</div> :
            <div key="conError" ></div>,
          signTransactionError !== null ?
            <div key="signError"  style={SendStyles.viewNotificationError}><div style={SendStyles.contentNestAddressDeleteIconHeader} onClick={() => this.props.clearSignTxError()}/>{signTransactionError}</div> :
            <div key="signError" ></div>,
          publishTransactionResponse !== null ?
            <div key="pubSuccess"  style={SendStyles.viewNotificationSuccess}><div style={SendStyles.contentNestAddressDeleteIconHeader} onClick={() => this.props.clearPublishTxSuccess()}/>Published Tx: {reverseHash(publishTransactionResponse.toString('hex'))}</div> :
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
            <div style={SendStyles.contentNestFromAddress}>
              <div style={SendStyles.contentNestPrefixConfirm}>Confirm transaction:</div>
            </div>
            <div style={SendStyles.contentNestToAddress} key="totalSpent">
              <div style={SendStyles.contentNestPrefixConfirm}>Total spent from wallet:</div>
              <div style={SendStyles.contentNestAddressHashBlockConfirm}>
                <Balance amount={totalSpent} />
              </div>
            </div>
            <div style={SendStyles.contentNestToAddress} key="estimatedSize">
              <div style={SendStyles.contentNestPrefixConfirm}>Estimated Transactions Size:</div>
              <div style={SendStyles.contentNestAddressHashBlockConfirm}>
                {constructTxResponse !== null ? constructTxResponse.getEstimatedSignedSize() : null} bytes
              </div>
            </div>
            <div style={SendStyles.contentNestToAddress} key="totalFee">
              <div style={SendStyles.contentNestPrefixConfirm}>Estimated Fee:</div>
              <div style={SendStyles.contentNestAddressHashBlockConfirm}>
                <Balance amount={estimatedFee} />
              </div>
            </div>
            <div style={SendStyles.contentNestToAddress} key="privatePassPhrase">
              <div style={SendStyles.contentNestPrefixConfirm}>Private Passhrase:</div>
              <div style={SendStyles.contentNestAddressHashBlock}>
                <div style={SendStyles.inputForm}>
                  <input
                    id="privpass"
                    style={SendStyles.contentNestAddressHashTo}
                    type="password"
                    placeholder="Private Password"
                    onBlur={(e) =>{this.setState({privpass: Buffer.from(e.target.value)});}}/>
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
          <div style={SendStyles.flexHeight}>
            <div style={SendStyles.contentNestFromAddress}>
              <div style={SendStyles.contentNestPrefixSend}>From:</div>
              {selectAccounts}
              <div style={SendStyles.contentNestFromAddressWalletIcon}></div>
            </div>
            <div id="dynamicInput">
            {this.state.outputs.map((output,i) => {
              if ( i == 0 ) {
                return(
                <div style={SendStyles.contentNestToAddress} key={output.key}>
                  <div style={SendStyles.contentNestPrefixSend}>To:</div>
                  <div style={SendStyles.contentNestAddressHashBlock}>
                    <div style={SendStyles.inputForm}>
                      <input
                        type="text"
                        style={SendStyles.contentNestAddressHashTo}
                        key={'destination'+output.key}
                        placeholder="Destination Address"
                        onBlur={(e) =>{this.updateOutputDestination(output.key, e.target.value);}}/>
                    </div>
                  </div>
                  <div style={SendStyles.contentNestAddressWalletIcon} onClick={() => this.appendOutput()}></div>
                  <div style={SendStyles.contentNestAddressAmount}>
                    <div style={SendStyles.contentNestPrefixSend}>Amount:</div>
                    <div style={SendStyles.contentNestAddressAmountSumAndCurrency}>
                    <div style={SendStyles.contentNestAddressAmountSumGradient}>{unitLabel}</div>
                      <input
                        type="text"
                        style={SendStyles.contentNestAddressAmountSum}
                        key={'amount'+output.key}
                        placeholder="Amount"
                        onBlur={(e) =>{this.updateOutputAmount(output.key, e.target.value, unitLabel);}}/>
                    </div>
                  </div>
                </div>);
              } else {
                return(
                <div style={SendStyles.contentNestDeleteAddress} key={output.key}>
                  <div style={SendStyles.contentNestAddressHashBlock}>
                    <div style={SendStyles.inputForm}>
                      <input
                        type="text"
                        style={SendStyles.contentNestAddressHashTo}
                        key={'destination'+output.key}
                        placeholder="Destination Address"
                        onBlur={(e) =>{this.updateOutputDestination(output.key, e.target.value);}}/>
                    </div>
                    <div style={SendStyles.contentNestGradient}></div>
                  </div>
                  {this.state.outputs.length - 1 === parseInt(output.key) ?
                    <div style={SendStyles.contentNestAddressDeleteIcon} onClick={() => this.removeOutput(output.key)}></div> :
                    <div></div>
                  }
                  <div style={SendStyles.contentNestAddressAmount}>
                    <div style={SendStyles.contentNestAddressAmountSumAndCurrency}>
                    <div style={SendStyles.contentNestAddressAmountSumGradient}>{unitLabel}</div>
                      <div style={SendStyles.inputForm}>
                      <input
                        type="text"
                        style={SendStyles.contentNestAddressAmountSum}
                        key={'amount'+output.key}
                        placeholder="Amount"
                        onBlur={(e) =>{this.updateOutputAmount(output.key, e.target.value, unitLabel);}}/>
                      </div>
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
