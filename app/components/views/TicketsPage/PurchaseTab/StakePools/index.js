import { substruct, compose, eq, get } from "fp";
import { FormattedMessage as T } from "react-intl";
import { shell } from "electron";
import StakePoolsList from "./List";
import StakePoolsAddForm from "./AddForm";
import { stakePools } from "connectors";
import { EnableExternalRequestButton } from "buttons";
import { EXTERNALREQUEST_STAKEPOOL_LISTING } from "main_dev/externalRequests";
@autobind
class StakePools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      apiKey: "",
      selectedUnconfigured: this.props.unconfiguredStakePools[0],
      hasFailedAttempt: false,
    };
    if (!props.updatedStakePoolList && this.getStakepoolListingEnabled()) {
      this.props.discoverAvailableStakepools();
    }
  }

  componentDidUpdate() {
    const configuredHost = this.state.selectedUnconfigured ? this.state.selectedUnconfigured.Host : "";
    const hasUnconfigured = this.props.unconfiguredStakePools.some(p => p.Host ===  configuredHost);
    if (!hasUnconfigured && this.props.unconfiguredStakePools.length) {
      // We just added a stakepool, so it has been removed from the list of
      // unconfigured. Select the next one on the list.
      this.setState({
        selectedUnconfigured: this.props.unconfiguredStakePools[0],
        apiKey: "",
        hasFailedAttempt: false
      });
    }
  }

  componentDidMount() {
    if(!this.state.selectedUnconfigured) {
      this.setState({ selectedUnconfigured: this.props.unconfiguredStakePools[0] });
    }
    if (!this.getStakepoolListingEnabled() && this.props.stakePoolListingEnabled) {
      this.props.discoverAvailableStakepools();
    }
  }

  renderStakepoolListingDisabled() {
    return (
      <div>
        <p><T id="stake.enableStakePoolListing.description" m="StakePool listing from external API endpoint is currently disabled. Please enable the access to this third party service or manually configure the stakepool." /></p>
        <EnableExternalRequestButton requestType={EXTERNALREQUEST_STAKEPOOL_LISTING}>
          <T id="stake.enableStakePoolListing.button" m="Enable StakePool Listing" />
        </EnableExternalRequestButton>
      </div>
    );
  }

  renderNoAvailableStakepools() {
    return (
      <T
        id="stake.noAvailableStakepools"
        m="No stakepool found. Check your internet connection or {link} to see if the StakePool API is down."
        values={{
          link: (<a className="stakepool-link" onClick={() => shell.openExternal("https://api.decred.org/?c=gsd")}><T id="stake.discoverStakeOoolsAPILink" m="this link" /></a>)
        }} />
    );
  }

  renderAddForm() {
    return (
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
    );
  }

  render() {
    if (this.getNoAvailableStakepools() && !this.getStakepoolListingEnabled()) {
      return this.renderStakepoolListingDisabled();
    }
    if (this.getNoAvailableStakepools()) {
      return this.renderNoAvailableStakepools();
    }
    if (this.getIsAdding()) {
      return this.renderAddForm();
    }

    return (
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
    return this.state.isAdding
      || this.props.configuredStakePools.length <= 0
      || this.props.isImportingScript;
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
    if (apiKey == "") {
      this.setState({ hasFailedAttempt: true });
    }
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
    if (!onSetInfo) return;
    if (!apiKey) {
      this.setState({ hasFailedAttempt: true });
      return;
    }
    onSetInfo(privpass, this.getSelectedUnconfigured().Host, apiKey, true);
  }

  onRemoveStakePool(host) {
    const { onRemoveStakePool } = this.props;
    onRemoveStakePool && onRemoveStakePool(host);
  }

  getStakepoolListingEnabled() {
    return this.props.stakePoolListingEnabled;
  }
}

export default stakePools(StakePools);
