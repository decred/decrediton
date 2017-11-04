// @flow
const Message = ({
  type,
  txHash
}) => (
  <div className="snackbar-information">
    <div className="snackbar-information-row">
      <div className="snackbar-information-row-tx">{txHash}</div>
    </div>
    <div className="snackbar-information-row">
      <div className="snackbar-information-row-type">{type}</div>
    </div>
  </div>
);

export default Message;
