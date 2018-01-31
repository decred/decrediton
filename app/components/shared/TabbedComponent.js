import { createElement as h, cloneElement as k } from "react";
import { RouteTransition, TabbedHeader } from "shared";
import { getTabs, getTab } from "helpers";
import theme from "theme";

const mapStyles = styles => ({ left: styles.left + "%" });

const enterLeft = { atEnter: { left: -100 }, atActive: { left: 0 }, atLeave: { left: 100 }, mapStyles };
const enterRight = { atEnter: { left: 100 }, atActive: { left: 0 }, atLeave: { left: -100 }, mapStyles };

const wrapperComponentDefault = props => <div className="component-tab-content" { ...props } />;

class TabbedPage extends React.Component{
  constructor(props) { super(props); }
  state = { prevTab: null };

  componentWillReceiveProps(nextProps) {
    if (getTab(this.props.routes) !== getTab(nextProps.routes)) {
      this.setState({ prevTab: getTab(this.props.routes) });
    }
  }
  render () {
    const { children, routes, className } = this.props;
    const { prevTab } = this.state;
    const tabs = getTabs(routes);
    const pathname = getTab(routes);
    const effect = !prevTab ? enterLeft : tabs.indexOf(prevTab) > tabs.indexOf(pathname) ? enterLeft : enterRight;
    const wrapperComponent = this.props.wrapperComponent ? this.props.wrapperComponent : wrapperComponentDefault;
    const header = this.props.header ? h(this.props.header, {routes, ...this.props}) : h(TabbedHeader, {routes});
    return (
      <Aux>
        {header}
        <RouteTransition className={className} opts={ theme("springs.tab") } {...{ wrapperComponent, pathname, ...effect }}>
          { k(children, {...this.props}) }
        </RouteTransition>
      </Aux>
    );
  }
}

TabbedPage.propTypes = {
  children: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default TabbedPage;
