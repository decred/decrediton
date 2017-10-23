import { spring, Motion } from "react-motion";
import { Link } from "react-router";
import { injectIntl, defineMessages, intlShape } from "react-intl";
import "style/Header.less";
import headerConnector from "connectors/header";

const opts = { stiffness: 150, damping: 20 };

const messages = defineMessages({
  "tickets.title":               { id: "tickets.title",               defaultMessage: "Tickets" },
  "tickets.description":         { id: "tickets.description",         defaultMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
  "tickets.tab.purchase":        { id: "tickets.tab.purchase",        defaultMessage: "Purchase Tickets" },
  "tickets.tab.mytickets":       { id: "tickets.tab.mytickets",       defaultMessage: "My Tickets" },
  "tickets.tab.governance":      { id: "tickets.tab.governance",      defaultMessage: "Governance" },
  "tickets.tab.statistics":      { id: "tickets.tab.statistics",       defaultMessage: "Statistics" },
});

@autobind
class Header extends React.Component {
  constructor(props) {
    super(props);
    this._nodes = new Map();
    this.state = { caretLeft: null, caretWidth: null, selectedTab: null };
  }
  componentDidMount() {
    this.updateCaretPosition(this.props.pathname);
  }

  componentDidUpdate() {
    if (this.state.selectedTab != this.props.pathname) {
      const caretPosition = this.neededCaretPosition(this.props.pathname);
      this.setState({ selectedTab: this.props.pathname, ...caretPosition });
    }
  }

  updateCaretPosition(tab) {
    const caretPosition = this.neededCaretPosition(tab);
    if (caretPosition) this.setState(caretPosition);
  }
  neededCaretPosition(tab) {
    const tabForRoute = this._nodes.get(tab);
    if (!tabForRoute) return null;
    const tabRect = tabForRoute.getBoundingClientRect();
    const caretLeft = tabForRoute.offsetLeft;
    const caretWidth = tabRect.width;
    return {caretLeft, caretWidth};
  }
  render () {
    const { page, tabs, intl } = this.props;
    const { caretLeft, caretWidth } = this.state;
    const description = [page, "description"].join(".");
    const headerIcon = ["header-icon", page].join("-");
    const title = [page, "title"].join(".");
    return (
      <div className="header">
        <div className="header-top"></div>

        <div className="tabbedheader-title">
          <span className={ "tabbedheader-icon " + headerIcon } />
          { intl.formatMessage(messages[title]) }
        </div>

        <div className="tabbedheader-description">
          { intl.formatMessage(messages[description]) }
        </div>

        <div className="tabbedheader-tabs">
          { tabs.map((tab) => {
            const title = [page, "tab", tab].join(".");
            const route = ["", page, tab].join("/");
            return (
              <div className="tabbedheader-ref" ref={ ref => this._nodes.set(tab, ref) } key={ tab }>
                <Link to={ route } className="tabbedheader-tab" >
                  { intl.formatMessage(messages[title]) }
                </Link>
              </div>
            );
          })}
          <Motion style={{ left: spring(caretLeft, opts), width: spring(caretWidth, opts) }}>
            { style => <div className="tabbedheader-active-tab-caret" style={ style }/> }
          </Motion>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  page: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape
};

export default injectIntl(headerConnector(Header));

/*
import React from "react";
import Header from "../../Header";
import Balance from "../../Balance";
import TextToggle from "../../TextToggle";
import "../../../style/StakePool.less";
import ticketsPage from "../../../connectors/ticketsPage";
import { FormattedMessage as T } from "react-intl";

const TicketsPageHeader = ({
  isShowingVotingPrefs,
  isShowingAddStakePool,
  ticketPrice,
  currentStakePoolConfigError,
  currentStakePoolConfigSuccessMessage,
  purchaseTicketsError,
  purchaseTicketsSuccess,
  revokeTicketsError,
  revokeTicketsSuccess,
  startAutoBuyerSuccess,
  stopAutoBuyerSuccess,
  startAutoBuyerError,
  stopAutoBuyerError,
  importScriptError,
  importScriptSuccess,
  onToggleTicketStakePool,
  onClearStakePoolConfigError,
  onClearStakePoolConfigSuccess,
  onClearPurchaseTicketsError,
  onClearPurchaseTicketsSuccess,
  onClearRevokeTicketsError,
  onClearRevokeTicketsSuccess,
  onClearStartAutoBuyerSuccess,
  onClearStopAutoBuyerSuccess,
  onClearStartAutoBuyerError,
  onClearStopAutoBuyerError,
  onClearImportScriptError,
  onClearImportScriptSuccess
}) => (
  <Header
    headerTop={[
      currentStakePoolConfigError ? (
        <div key="updateStakePoolError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStakePoolConfigError}/>
          {currentStakePoolConfigError}
        </div>
      ) : null,
      currentStakePoolConfigSuccessMessage ? (
        <div key="configSuccess"  className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStakePoolConfigSuccess}/>
          {currentStakePoolConfigSuccessMessage}
        </div>
      ) : null,
      purchaseTicketsError ? (
        <div key="purchaseTicketsError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearPurchaseTicketsError}/>
          {purchaseTicketsError}
        </div>
      ) : null,
      purchaseTicketsSuccess ? (
        <div key="purchaseTicketsSuccess" className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearPurchaseTicketsSuccess}/>
          {purchaseTicketsSuccess}
        </div>
      ) : null,
      revokeTicketsError ? (
        <div key="revokeTicketsError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearRevokeTicketsError}/>
          {revokeTicketsError}
        </div>
      ) : null,
      revokeTicketsSuccess ? (
        <div key="revokeTicketsSuccess" className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearRevokeTicketsSuccess}/>
          {revokeTicketsSuccess}
        </div>
      ) : null,
      startAutoBuyerSuccess ? (
        <div key="startAutoBuyerSuccess" className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStartAutoBuyerSuccess}/>
          {startAutoBuyerSuccess}
        </div>
      ) : null,
      stopAutoBuyerSuccess ? (
        <div key="stopAutoBuyerSuccess" className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStopAutoBuyerSuccess}/>
          {stopAutoBuyerSuccess}
        </div>
      ) : null,
      startAutoBuyerError ? (
        <div key="startAutoBuyerError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStartAutoBuyerError}/>
          {startAutoBuyerError}
        </div>
      ) : null,
      stopAutoBuyerError ? (
        <div key="stopAutoBuyerError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearStopAutoBuyerError}/>
          {stopAutoBuyerError}
        </div>
      ) : null,
      importScriptError ? (
        <div key="importScriptError" className="stakepool-view-notification-error">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearImportScriptError}/>
          {importScriptError}
        </div>
      ) : null,
      importScriptSuccess ? (
        <div key="importScriptSuccess" className="stakepool-view-notification-success">
          <div className="stakepool-content-nest-address-delete-icon" onClick={onClearImportScriptSuccess}/>
          {importScriptSuccess}
        </div>
      ) : null
    ]}
    headerTitleOverview={
      <div style={{height: "100%"}}>
        <div style={{float: "left"}}>
          {isShowingAddStakePool
            ? <T id="stake.titleSettings" m="Stake pool settings" />
            : isShowingVotingPrefs ? "" : <T id="stake.titleTicketPrice" m="Ticket price" />}:
        </div>
      </div>
    }
    headerMetaOverview={
      isShowingAddStakePool ? null : (
        <div>
          <Balance amount={ticketPrice} />
          <div className="stakepool-toggle">
            <TextToggle
              activeButton={"left"}
              leftText={<T id="stake.purchaseTicketsTab" m="Purchase Tickets" />}
              rightText={<T id="stake.voteSettingsTab" m="Vote Settings" />}
              toggleAction={onToggleTicketStakePool}
            />
          </div>
        </div>
      )
    }
  />
);

export default ticketsPage(TicketsPageHeader);
*/
