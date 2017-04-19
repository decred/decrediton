import React from 'react';
import Radium from 'radium';
import { StakePoolStyles } from './views/ViewStyles';

class NumTicketsInput extends React.Component {
  render() {
    return (
      <div style={StakePoolStyles.numTicketsInputArea}>
        <div style={StakePoolStyles.numTicketsInput}>
          <input style={StakePoolStyles.numTicketsInputValue} type="text" readOnly placeholder="" value={this.props.numTickets} data-max-width="70"/>
          <div style={StakePoolStyles.numTicketsInputValueSuffix}>Tickets</div>
          <span style={StakePoolStyles.numTicketsInputValueSpan} style={{display: 'none', fontSize: '19px'}}>10000</span>
        </div>
        <div style={StakePoolStyles.numTicketsMoreLess}>
          <a key='more' style={StakePoolStyles.numTicketsMore} onClick={()=>this.props.incrementNumTickets()}></a>
          <a key='less' style={StakePoolStyles.numTicketsLess} onClick={()=>this.props.decrementNumTickets()}></a>
        </div>
      </div>
    );

  }
}

export default Radium(NumTicketsInput);