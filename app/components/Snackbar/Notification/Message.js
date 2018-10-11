// @flow
import { injectIntl } from "react-intl";

@autobind
class Message extends React.Component {
  render() {
    const { intl, message, values, onDismissMessage } = this.props;
    const txt = intl.formatMessage(message, values);
    return (
      <div className="snackbar-message">
        <div className="snackbar-close-button-top" onClick={onDismissMessage}/>
        {txt}
      </div>
    );
  }
}

export default injectIntl(Message);
