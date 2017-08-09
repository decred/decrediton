// @flow
import React from "react";
import "../style/NumTicketsInput.less";

class NumTicketsInput extends React.Component {
  render() {
    return (
      <div className="num-tickets-input-area">
        <div className="num-tickets-input">
          <input className="num-tickets-input-value" type="text" readOnly placeholder="" value={this.props.numTickets} data-max-width="70"/>
          <div className="num-tickets-input-value-suffix">Tickets</div>
          <span className="num-tickets-input-value-span">10000</span>
        </div>
        <div className="num-tickets-more-less">
          <a key="more" className="num-tickets-more" onClick={()=>this.props.incrementNumTickets()}></a>
          <a key="less" className="num-tickets-less" onClick={()=>this.props.decrementNumTickets()}></a>
        </div>
      </div>
    );

  }
}

export default NumTicketsInput;
