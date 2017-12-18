import "style/NumTicketsInput.less";

const NumTicketsInput = ({
  numTickets,
  incrementNumTickets,
  decrementNumTickets
}) => (
  <div className="num-tickets-input-area">
    <div className="num-tickets-input">
      <input className="num-tickets-input-value" type="text" readOnly placeholder="" value={numTickets} data-max-width="70"/>
      <span className="num-tickets-input-value-span">10000</span>
    </div>
    <div className="num-tickets-more-less">
      <a key="more" className="num-tickets-more" onClick={incrementNumTickets}></a>
      <a key="less" className="num-tickets-less" onClick={decrementNumTickets}></a>
    </div>
  </div>
);

export default NumTicketsInput;
