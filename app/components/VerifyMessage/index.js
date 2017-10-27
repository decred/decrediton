import { FormattedMessage as T, injectIntl } from "react-intl";
import { Icon, Flex, Box, Heading } from "shared";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import VerifyMessageForm from "./Form";
import { verifyMessagePage } from "connectors";
import "style/SecurityCenterMessagePage.less";

@autobind
class VerifyMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.getMessageVerificationServiceAttempt();
  }

  componentWillUnmount() {
    this.props.verifyMessageCleanStore();
  }

  render() {
    const { verifyMessageError, verifyMessageSuccess, messageVerificationService } = this.props;

    if (!messageVerificationService) {
      return <div><T id="securitycenter.loading" m="Loading..." /></div>;
    }

    let result = null;
    if (verifyMessageSuccess) {
      const isValid = verifyMessageSuccess.valid;
      let isValidDisplay = null;
      if (isValid) {
        isValidDisplay = <T id="securitycenter.verify.result.valid" m="Valid signature!" />;
      } else {
        isValidDisplay = <T id="securitycenter.verify.result.invalid" m="Invalid signature!" />;
      }

      result = (
        <div className="message-nest">
          <div className={`message-content ${isValid ? "valid" : "invalid"}`}>
            {isValidDisplay}
          </div>
        </div>
      );
    }

    return (
      <Box p={ 70 }>
        <Flex align="center" pb={ 10 }>
          <Icon i="cog" s={ 30 } pr={ 20 } />
          <Heading><T id="securitycenter.verify.header" m="Verify Message" /></Heading>
        </Flex>
        <div className="message">
          <VerifyMessageForm onSubmit={this.onSubmit} rpcError={verifyMessageError} formatMessage={this.props.intl.formatMessage} />
          {result}
        </div>
      </Box>
    );
  }

  onSubmit(props) {
    this.props.verifyMessageAttempt(props);
  }
}

VerifyMessage.propTypes = {
  intl: PropTypes.object.isRequired,
  getMessageVerificationServiceAttempt: PropTypes.func.isRequired,
  verifyMessageCleanStore: PropTypes.func.isRequired,
  verifyMessageError: PropTypes.string,
  verifyMessageSuccess: PropTypes.shape({
    signature: PropTypes.string,
  }),
};

export default verifyMessagePage(injectIntl(VerifyMessage));
