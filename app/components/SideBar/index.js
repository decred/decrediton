import Bar from "./Bar";
import { rescan, sideBar } from "connectors";

@autobind
class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingAccounts: false
    };
  }

  render() {

    return (
      <Bar
        {...{
          ...this.props,
          isShowingAccounts: this.state.isShowingAccounts,
          onShowAccounts: this.onShowAccounts,
          onHideAccounts: this.onHideAccounts
        }}
      />
    );
  }

  onShowAccounts() {
    this.setState({ isShowingAccounts: true });
  }

  onHideAccounts() {
    this.setState({ isShowingAccounts: false });
  }
}

SideBar.propTypes = {
  expandSideBar: PropTypes.bool.isRequired
};

export default sideBar(rescan(SideBar));
