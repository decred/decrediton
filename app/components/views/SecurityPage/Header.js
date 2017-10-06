import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import Header from "../../Header";
import TextToggle from "../../TextToggle";
import "../../../style/StakePool.less";

const messages = defineMessages({
  signMessage: {
    id: "securitycenter.header.toggle.sign",
    defaultMessage: "Sign message",
  },
  verifyMessage: {
    id: "securitycenter.header.toggle.verify",
    defaultMessage: "Verify message",
  },
});

const SecurityPageHeader = ({
  onToggleSecurityMessage,
  intl: { formatMessage }
}) => (
  <Header
    headerTitleOverview={
      <div style={{height: "100%"}}>
        <div style={{float: "left"}}>
          <T id="securitycenter.header.title" m="Security Center" />
        </div>
      </div>
    }
    headerMetaOverview={
      (
        <div>
          <div className="stakepool-toggle">
            <TextToggle
              activeButton={"left"}
              leftText={formatMessage(messages.signMessage)}
              rightText={formatMessage(messages.verifyMessage)}
              toggleAction={onToggleSecurityMessage}
            />
          </div>
        </div>
      )
    }
  />
);

SecurityPageHeader.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  onToggleSecurityMessage: PropTypes.func.isRequired,
};

export default injectIntl(SecurityPageHeader);
