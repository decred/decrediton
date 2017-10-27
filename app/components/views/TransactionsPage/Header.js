import { spring, Motion } from "react-motion";
import { Link } from "react-router";
import { injectIntl, defineMessages, intlShape } from "react-intl";
import "style/Header.less";
import headerConnector from "connectors/header";

const opts = { stiffness: 150, damping: 20 };

const messages = defineMessages({
  "transactions.title":               { id: "transactions.title",               defaultMessage: "Transactions" },
  "transactions.description.testnet": { id: "transactions.description.testnet", defaultMessage: "Testnet Decred addresses always begin with letter T and contain 26-35 alphanumeric characters (e.g. TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0)." },
  "transactions.description.mainnet": { id: "transactions.description.mainnet", defaultMessage: "Mainnet Decred addresses always begin with letter D and contain 26-35 alphanumeric characters (e.g. DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X)." },
  "transactions.tab.send":            { id: "transactions.tab.send",            defaultMessage: "Send" },
  "transactions.tab.receive":         { id: "transactions.tab.receive",         defaultMessage: "Receive" },
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
    const { isTestNet, page, tabs, intl } = this.props;
    const { caretLeft, caretWidth } = this.state;
    const description = [page, "description", isTestNet ? "testnet" : "mainnet"].join(".");
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
  isTestNet: PropTypes.bool,
  page: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape
};

export default injectIntl(headerConnector(Header));
