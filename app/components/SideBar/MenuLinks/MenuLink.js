import { NavLink as Link } from "react-router-dom";
import { Lottie } from "shared";

@autobind
class MenuLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = { animationStopped: true };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.active && this.props.active && !this.state.animationStopped) {
      this.setState({ animationStopped: true });
    }
  }

  onEnter() {
    this.setState({ animationStopped: this.props.active });
  }

  onLeave() {
    this.setState({ animationStopped: true });
  }

  render() {
    const { onEnter, onLeave } = this;
    const { linkRef, hasNotification, animationData, link, to } = this.props;
    const { animationStopped } = this.state;

    return (
      <div ref={linkRef} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        { hasNotification ? <span className="sidebar-menu-link-notification-icon"></span> : null}

        <Link to={to} className="menu-link" activeClassName="menu-link-active">
          <Lottie
            animationData={animationData}
            stopped={animationStopped}
            autoplay={false}
            className="sidebar-menu-nav-icon"
          />
          {link}
        </Link>
      </div>
    );
  }
}

export default MenuLink;
