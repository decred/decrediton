// @flow
import { injectIntl } from "react-intl";
import { ProgressRing } from "indicators";

@autobind
class Message extends React.Component {
  render() {
    const { intl, message, values, onDismissMessage, progress, topNotification } = this.props;
    const txt = intl.formatMessage(message, values);
    return (
      <div className="snackbar-message">
        {topNotification &&
        <div className="snackbar-close-button-top" onClick={onDismissMessage}>
          <ProgressRing
            radius={ 13 }
            stroke={ 2 }
            progress={ progress }
          />
        </div>}
        {txt}
      </div>
    );
  }
}

export default injectIntl(Message);
