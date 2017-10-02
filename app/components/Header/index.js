import React from "react";
import { autobind } from "core-decorators";
import GetStarted from "./GetStarted";
import StandardHeader from "./Header";
import headerConnector from "../../connectors/header";

const MSG_DELAY = 4500; // Used when multiple messages come in, should probably queue instead

@autobind
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: "teste" };
    this.timeout = null;
  }

  componentWillReceiveProps(nextProps) {
    const { newUnminedMessage } = nextProps;

    if (newUnminedMessage && this.props.newUnminedMessage !== newUnminedMessage) {
      if (this.state.message) {
        this.timeout = setTimeout(()=>this.setState({ message: nextProps.newUnminedMessage }), MSG_DELAY);
      } else {
        this.setState({ message: nextProps.newUnminedMessage });
      }
    }
  }
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  render() {
    const {
      getStarted,
      headerTop,
      headerTitleOverview,
      headerMetaOverview,
      children
    } = this.props;
    const { message } = this.state;
    const { onDismissMessage } = this;

    return getStarted ? (
      <GetStarted
        {...{
          headerTop,
          headerTitleOverview,
          headerMetaOverview,
          children
        }}
      />
    ) : (
      <StandardHeader
        {...{
          headerTop,
          headerTitleOverview,
          headerMetaOverview,
          message,
          onDismissMessage,
          children
        }}
      />
    );
  }

  onDismissMessage() {
    this.setState({ message: null });
  }
}

export default headerConnector(Header);
