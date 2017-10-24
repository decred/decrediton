import { spring, Motion } from "react-motion";
import { Link } from "react-router";
import { injectIntl, defineMessages, intlShape } from "react-intl";
import "style/Header.less";
import headerConnector from "connectors/header";

const opts = { stiffness: 150, damping: 20 };

const messages = defineMessages({
  "tickets.title":               { id: "tickets.title",               defaultMessage: "Tickets" },
  //"tickets.description":         { id: "tickets.description",         defaultMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  "tickets.tab.purchase":        { id: "tickets.tab.purchase",        defaultMessage: "Purchase Tickets" },
  "tickets.tab.mytickets":       { id: "tickets.tab.mytickets",       defaultMessage: "My Tickets" },
  "tickets.tab.governance":      { id: "tickets.tab.governance",      defaultMessage: "Governance" },
  "tickets.tab.statistics":      { id: "tickets.tab.statistics",      defaultMessage: "Statistics" },
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
    //const description = [page, "description"].join(".");
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
          { /*intl.formatMessage(messages[description])*/ }
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
