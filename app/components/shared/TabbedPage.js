import { RouteTransition, TabbedHeader } from "shared";
import { getTabs, getPage } from "helpers";
import theme from "theme";

const mapStyles = styles => ({ left: styles.left + "%" });

const enterLeft = { atEnter: { left: -100 }, atActive: { left: 0 }, atLeave: { left: 100 }, mapStyles };
const enterRight = { atEnter: { left: 100 }, atActive: { left: 0 }, atLeave: { left: -100 }, mapStyles };

const wrapperComponent = props => <div className="tab-content" { ...props } />;

class TabbedPage extends React.Component{
  constructor(props) { super(props); }
  state = { prevRoute: null };

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setState({prevRoute: this.props.location.pathname.split("/")[2]});
    }
  }
  render () {
    const { children, routes, route: { testNet, noDesc}} = this.props;
    const { prevRoute } = this.state;
    const tabs = getTabs(routes);
    const pathname = getPage(routes);
    const effect = !prevRoute ? enterLeft : tabs.indexOf(prevRoute) > tabs.indexOf(pathname) ? enterLeft : enterRight;
    return (
      <Aux>
        <TabbedHeader {...{ testNet, noDesc }}/>
        <RouteTransition className="tabbed-page" opts={ theme("springs.tab") } {...{ wrapperComponent, pathname, ...effect }}>
          { children }
        </RouteTransition>
      </Aux>
    );
  }
}

TabbedPage.propTypes = { location: PropTypes.object.isRequired };

export default TabbedPage;
