// @flow
import { injectIntl } from "react-intl";

@autobind
class Message extends React.Component {
  render() {
    const { intl, message, values, onDismissMessage, topNotification } = this.props;
    const txt = intl.formatMessage(message, values);
    return (
      <div className="snackbar-message">
        {topNotification && <div className="snackbar-close-button-top" onClick={onDismissMessage}/>}
        {txt}
      </div>
    );
  }
}

export default injectIntl(Message);
