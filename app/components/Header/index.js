// @flow
import React from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";
import GetStarted from "./GetStarted";
import StandardHeader from "./Header";

const MSG_DELAY = 4500; // Used when multiple messages come in, should probably queue instead

@autobind
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: null };
  }

  componentWillReceiveProps(nextProps) {
    const { newUnminedMessage } = nextProps;

    if (newUnminedMessage && this.props.newUnminedMessage !== newUnminedMessage) {
      if (this.state.message) {
        setTimeout(()=>this.setState({ message: nextProps.newUnminedMessage }), MSG_DELAY);
      } else {
        this.setState({ message: nextProps.newUnminedMessage });
      }
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

const mapStateToProps = ({ notifications: { newUnminedMessage } }) => ({
  newUnminedMessage
});

export default connect(mapStateToProps)(Header);
