import { RouteTransition, TabbedHeader } from "shared";
import { getTabs, getTab } from "helpers";
import theme from "theme";

const mapStyles = styles => ({ left: styles.left + "%" });

const enterLeft = { atEnter: { left: -100 }, atActive: { left: 0 }, atLeave: { left: 100 }, mapStyles };
const enterRight = { atEnter: { left: 100 }, atActive: { left: 0 }, atLeave: { left: -100 }, mapStyles };

const wrapperComponent = props => <div className="tab-content" { ...props } />;

class TabbedPage extends React.Component{
  constructor(props) { super(props); }
  state = { prevTab: null };

  componentWillReceiveProps(nextProps) {
    if (getTab(this.props.routes) !== getTab(nextProps.routes)) {
      this.setState({ prevTab: getTab(this.props.routes) });
    }
  }
  render () {
    const { children, routes } = this.props;
    const { prevTab } = this.state;
    const tabs = getTabs(routes);
    const pathname = getTab(routes);
    const effect = !prevTab ? enterLeft : tabs.indexOf(prevTab) > tabs.indexOf(pathname) ? enterLeft : enterRight;
    return (
      <Aux>
        <TabbedHeader {...{ routes }}/>
        <RouteTransition className="tabbed-page" opts={ theme("springs.tab") } {...{ wrapperComponent, pathname, ...effect }}>
          { children }
        </RouteTransition>
      </Aux>
    );
  }
}

TabbedPage.propTypes = { location: PropTypes.object.isRequired };

export default TabbedPage;
