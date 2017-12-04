import GetStarted from "./GetStarted";
import StandardHeader from "./Header";

@autobind
class Header extends React.Component {
  render() {
    const {
      getStarted,
      headerTop,
      headerTitleOverview,
      headerMetaOverview,
      children
    } = this.props;

    const Component = getStarted ? GetStarted : StandardHeader;

    return <Component
      {...{
        headerTop,
        headerTitleOverview,
        headerMetaOverview,
        children
      }}/>;
  }
}

export default Header;
