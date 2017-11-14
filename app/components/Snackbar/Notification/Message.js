// @flow
import { injectIntl } from "react-intl";

@autobind
class Message extends React.Component {
  render() {
    const { intl, message, values } = this.props;
    const txt = intl.formatMessage(message, values);
    return (
      <div className="snackbar-message">
        {txt}
      </div>
    );
  }
}

export default injectIntl(Message);
