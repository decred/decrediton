// @flow
import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import "../../style/Header.less";

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {caretLeft: 10, caretWidth: 15};
  }

  componentDidMount() {
    const caretPosition = this.neededCaretPosition();
    const state = this.state;
    this.setState({...state, ...caretPosition})
  }

  componentWillReceiveProps(oldState, newState) {
    const caretPosition = this.neededCaretPosition();
    if ((caretPosition.caretLeft != newState.caretLeft) || (caretPosition.caretWidth != newState.caretWidth)) {
      this.setState({...newState, ...caretPosition})
    }
  }

  neededCaretPosition() {
    const { router } = this.props;
    const tabForRoute = ReactDOM.findDOMNode(this.refs[router.location.pathname])
    const tabRect = tabForRoute.getBoundingClientRect();
    const caretLeft = tabForRoute.offsetLeft - 5;
    const caretWidth = tabRect.width + 5;
    return {caretLeft, caretWidth};
  }

  render() {
    const { iconClassName, title, description, tabRoutes, pathname } = this.props;
    const { caretLeft, caretWidth } = this.state;
    return (
      <div>
        <div className="header">
          <div className="header-top"></div>

          <div className="tabbedheader-title">
            <span className={"tabbedheader-icon " + (iconClassName ? iconClassName : "")} />
            {title}
          </div>

          <div className="tabbedheader-description">
            {description}
          </div>

          <div className="tabbedheader-tabs">
            {tabRoutes.map(tabRoute => (
              <Link
                to={tabRoute.route}
                className="tabbedheader-tab"
                key={tabRoute.route}
                ref={tabRoute.route}
              >
                {tabRoute.title}
              </Link>
            ))}
            <div
              className="tabbedheader-active-tab-caret"
              style={{left: caretLeft, width: caretWidth}}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
