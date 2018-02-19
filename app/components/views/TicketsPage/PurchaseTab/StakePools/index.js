import { substruct, compose, eq, get } from "fp";
import { FormattedMessage as T } from "react-intl";
import { shell } from "electron";
import StakePoolsList from "./List";
import StakePoolsAddForm from "./AddForm";
import stakePools from "connectors/stakePools";

@autobind
class StakePools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      apiKey: "",
      selectedUnconfigured: this.props.unconfiguredStakePools[0]
    };
    if (this.getNoAvailableStakepools()) {
      this.props.discoverAvailableStakepools();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.selectedUnconfigured) {
      this.setState({ selectedUnconfigured: nextProps.unconfiguredStakePools[0] });
    }
  }

  render() {
    return this.getNoAvailableStakepools() ? (
      <T
        id="stake.noAvailableStakepools"
        m="No stakepool found. Check your internet connection or {link} to see if the StakePool API is down."
        values={{
          link: (<a className="stakepool-link" onClick={() => shell.openExternal("https://api.decred.org/?c=gsd")}><T id="stake.discoverStakeOoolsAPILink" m="this link" /></a>)
        }} />
    ) : this.getIsAdding() ? (
      <StakePoolsAddForm
        {...{
          ...this.props,
          ...this.state,
          selectedUnconfigured: this.getSelectedUnconfigured(),
          ...substruct({
            onChangeApiKey: null,
            onSaveStakePool: null,
            onSetStakePoolInfo: null,
            onChangeSelectedUnconfigured: null,
            onCancelPassphraseRequest: null,
            onCancelAddStakePool: null,
            onRemoveStakePool: null
          }, this),
        }}
      />
    ) : (
      <StakePoolsList
        {...{
          ...this.props,
          ...substruct({
            onShowAddStakePool: null
          }, this)
        }}
      />
    );
  }

  getIsAdding() {
    return this.state.isAdding || this.props.configuredStakePools.length <= 0;
  }

  getNoAvailableStakepools() {
    return (this.props.unconfiguredStakePools.length === 0) && (this.props.configuredStakePools.length === 0);
  }

  getSelectedUnconfigured() {
    const pool = this.state.selectedUnconfigured;
    return pool
      ? this.props.unconfiguredStakePools.find(compose(eq(pool.Host), get("Host")))
      : null;
  }

  onChangeSelectedUnconfigured(selectedUnconfigured) {
    this.setState({ selectedUnconfigured });
  }

  onShowAddStakePool() {
    this.setState({ isAdding: true });
  }

  onChangeApiKey(apiKey) {
    this.setState({ apiKey });
  }

  onCancelAddStakePool() {
    const { onHideStakePoolConfig } = this.props;
    this.setState({ isAdding: false });
    onHideStakePoolConfig && onHideStakePoolConfig();
  }

  onSetStakePoolInfo(privpass) {
    const { apiKey } = this.state;
    const onSetInfo = this.props.onSetStakePoolInfo;
    apiKey ? (onSetInfo && onSetInfo(privpass, this.getSelectedUnconfigured().Host, apiKey, 0)) : null;
  }

  onRemoveStakePool(host) {
    const { onRemoveStakePool } = this.props;
    onRemoveStakePool && onRemoveStakePool(host);
  }
}

export default stakePools(StakePools);
