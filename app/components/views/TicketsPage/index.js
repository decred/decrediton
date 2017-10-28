import Header from "./Header";
import { RouteTransition } from "shared";

const mapStyles = styles => ({ left: styles.left + "%" });

const enterLeft = { atEnter: { left: -100 }, atActive: { left: 0 }, atLeave: { left: 100 }, mapStyles };
const enterRight = { atEnter: { left: 100 }, atActive: { left: 0 }, atLeave: { left: -100 }, mapStyles };
const opts = { stiffness: 150, damping: 20 };

const wrapperComponent = props => <div className="tab-content" { ...props } />;

class Tickets extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      prevRoute: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setState({prevRoute: this.props.location.pathname.split("/")[2]});
    }
  }
  render () {
    const { children, location } = this.props;
    const { prevRoute } = this.state;
    const tabs = ["purchase", "mytickets", "governance", "statistics"];
    const page = "tickets";
    // this will be removed w/ react router 4
    const pathname = location.pathname.split("/")[2];
    const effect = !prevRoute ? enterLeft : tabs.indexOf(prevRoute) > tabs.indexOf(pathname) ? enterLeft : enterRight;
    return (
      <Aux>
        <Header {...{ tabs, page, pathname }}/>
        <RouteTransition className="tabbed-page" {...{ wrapperComponent, opts, pathname, ...effect }}>
          { children }
        </RouteTransition>
      </Aux>
    );
  }
}

Tickets.propTypes = { location: PropTypes.object.isRequired };

export default Tickets;
