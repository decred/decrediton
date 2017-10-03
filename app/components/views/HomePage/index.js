import React from "react";
import ErrorScreen from "../../ErrorScreen";
import HomePage from "./Page";
import service from "../../../connectors/service";
import {substruct} from "../../../fp.js"

class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      passphraseHeading: null,
      passphraseDescription: null,
      passphraseCallback: null,
      isRequestingPassphrase: false
    };
  }

  render() {
    return this.props.walletService ? 
    <HomePage 
    {...{
      ...this.props,
      ...this.state,
      ...substruct({
        onShowRevokeTicket: null,
        onRequestPassphrase: null,
        onCancelPassphraseRequest: null,
      }, this)
      }} /> : <ErrorScreen />;
  }

  checkTicketsToBeRevoked(){
    return revokedTicketsCount !== (expiredTicketsCount+missedTicketsCount)
  }

  onRevokeTickets(privpass) {
    const { onRevokeTickets } = this.props;
    onRevokeTickets && onRevokeTickets(privpass);
    this.onCancelPassphraseRequest();
  }
  
  onRequestPassphrase(passphraseHeading, passphraseDescription, passphraseCallback) {
    this.setState({
      passphraseHeading,
      passphraseDescription,
      passphraseCallback,
      isRequestingPassphrase: true
    });
  }

  onShowRevokeTicket() {
    this.onRequestPassphrase("Enter Passphrase to Revoke Tickets", null, this.onRevokeTickets)
  }

  onCancelPassphraseRequest() {
    this.setState({
      isRequestingPassphrase: false,
      passphraseHeading: null,
      passphraseDescription: null,
      passphraseCallback: null
    });
  }
  
}

export default service(Home);
