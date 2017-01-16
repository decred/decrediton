import React, { Component } from 'react';

class WalletError extends Component {
  render() {
    const errorView = (
      <div>
        <p> We have detected that your wallet has disconnected.
            Please reload Decrediton to fix this problem. </p>
      </div>);
    return (errorView);
  }
}
export default WalletError;