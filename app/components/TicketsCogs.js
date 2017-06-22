// @flow
import React from 'react';
import Radium from 'radium';
import { StakePoolStyles } from './views/ViewStyles';

class TicketsCogs extends React.Component {
  render() {
    return (
      <a style={this.props.opened ? StakePoolStyles.ticketCogsOpened : StakePoolStyles.ticketCogsClosed} onClick={this.props.onClick}></a>
    );

  }
}

export default Radium(TicketsCogs);