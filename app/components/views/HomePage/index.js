import React from "react";
import { autobind } from "core-decorators";
import ErrorScreen from "../../ErrorScreen";
import HomePage from "./Page";
import service from "../../../connectors/service";
import home from "../../../connectors/home";
import {substruct} from "../../../fp.js";

@autobind
class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      onCancelPassphraseRequest: null,
      passphraseHeading: null,
      passphraseDescription: null,
      passphraseCallback: null,
      isRequestingPassphrase: false
    };
  }

  componentWillMount() {
    this.props.onClearRevokeTicketsSuccess();
    this.props.onClearRevokeTicketsError();
  }

  render() {
    return this.props.walletService ? <HomePage
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
    this.onRequestPassphrase("Enter Passphrase to Revoke Tickets", null, this.onRevokeTickets);
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

export default service(home(Home));
