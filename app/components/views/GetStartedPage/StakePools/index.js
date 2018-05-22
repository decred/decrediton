import { substruct, compose, eq, get } from "fp";
import { stakePools } from "connectors";
import { EnableExternalRequestButton } from "buttons";
import { EXTERNALREQUEST_STAKEPOOL_LISTING } from "main_dev/externalRequests";
import Form from "./Form";

@autobind
class StakePoolsBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      apiKey: "",
      selectedUnconfigured: this.props.unconfiguredStakePools[0]
    };
    if (!props.updatedStakePoolList && this.getStakepoolListingEnabled()) {
      this.props.discoverAvailableStakepools();
    }
  }

  getNoAvailableStakepools() {
    return (this.props.unconfiguredStakePools.length === 0) && (this.props.configuredStakePools.length === 0);
  }

  getStakepoolListingEnabled() {
    return this.props.stakePoolListingEnabled;
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

  onChangeApiKey(apiKey) {
    this.setState({ apiKey });
  }

  onSetStakePoolInfo(privpass) {
    const { apiKey } = this.state;
    const onSetInfo = this.props.onSetStakePoolInfo;
    apiKey ? (onSetInfo && onSetInfo(privpass, this.getSelectedUnconfigured().Host, apiKey, 0)) : null;
  }

  render() {
    if (this.getNoAvailableStakepools() && !this.getStakepoolListingEnabled()) {
      return (
        <div>
          <p><T id="stake.enableStakePoolListing.description" m="StakePool listing from external API endpoint is currently disabled. Please enable the access to this third party service or manually configure the stakepool." /></p>
          <EnableExternalRequestButton requestType={EXTERNALREQUEST_STAKEPOOL_LISTING}>
            <T id="stake.enableStakePoolListing.button" m="Enable StakePool Listing" />
          </EnableExternalRequestButton>
        </div>
      );
    }

    return (
      <Form
        {...{
          ...this.props,
          ...this.state,
          selectedUnconfigured: this.getSelectedUnconfigured(),
          ...substruct({
            onChangeApiKey: null,
            onSaveStakePool: null,
            onSetStakePoolInfo: null,
            onChangeSelectedUnconfigured: null,
          }, this),
        }}
      />
    );
  }
}

export default stakePools(StakePoolsBody);
