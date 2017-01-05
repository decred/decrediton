// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorScreen from './ErrorScreen';

const style = {
  margin: 12,
};

class Receive extends Component{
  static propTypes = {
    walletService: PropTypes.object,
    getNextAddressResponse: PropTypes.object,
    getNextAddressRequestAttempt: PropTypes.bool.isRequired,
  };

  render() {
    const { walletService } = this.props;
    const { getNextAddressResponse, getNextAddressAttempt, getNextAddressRequestAttempt } = this.props;
    const { getNextAddressError } = this.props;
    const { constructTxRequestAttempt, constructTransactionAttempt, constructTxResponse } = this.props;
    const { publishTransactionResponse } = this.props;
    /* View that will be seen when user has a set Client */
    const receiveView = (
      <div>
        <h1>Receive Page</h1>
        <h3>Current address: {getNextAddressResponse === null ? 'Please refresh' : getNextAddressResponse.getAddress() }</h3>
        <RaisedButton
          style={style}
          disabled={getNextAddressRequestAttempt}
          onClick={!getNextAddressRequestAttempt? () => this.props.getNextAddressAttempt(0) : null}
          label={getNextAddressRequestAttempt ? 'Getting new address' : 'Get New Address'}/>
      </div>);
    const copayReceive = (
      	<div id="page-content-wrapper">
					<div class="row row-first-heading row-wallet-settings">
						<div class="col-xs-12">
							<p>My Decred Address</p>
						</div>
					</div>
					<div class="row row-my-decred text-center grey-background">
						<div class="col-xs-12 white-background">
							<img src="img/qr.jpg" alt="" />
						</div>
						<div class="col-xs-12">
							<input type="text" class="form-control input-well-code" value="DsVmEFoSorV3bpTQHshHpV1asdfKSTkqskC" />
							<p>Share this wallet address to receive payments, To protect your privacy, new addresses are generated automatically once you use them.</p>
						</div>
						<div class="col-xs-12">
							<button type="button" class="btn btn-info">Generate new address</button>
						</div>
					</div>
				</div>
    )
    /* Check to see that client is not undefined */
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(copayReceive);
    }
  }
}

export default Receive;
