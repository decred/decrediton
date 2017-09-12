import React from "react";
import { autobind } from "core-decorators";
import { substruct, compose, eq, get } from "../../fp";
import StakePoolsList from "./List";
import StakePoolsAddForm from "./AddForm";
import stakePools from "../../connectors/stakePools";

@autobind
class StakePools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      apiKey: "",
      selectedUnconfigured: this.props.unconfiguredStakePools[0]
    };
  }

  render() {
    return this.getIsAdding() ? (
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
            onCancelAddStakePool: null
          }, this),
          onSetStakePoolInfo: this.onSetStakePoolInfo
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
    this.setState({ isAdding: false });
  }

  onChangeApiKey(apiKey) {
    this.setState({ apiKey });
  }

  onSaveStakePool() {
    this.state.apiKey ? this.setState({ isRequestingPassphrase: true }) : null;
  }

  onCancelPassphraseRequest() {
    this.setState({ isRequestingPassphrase: false });
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
}

export default stakePools(StakePools);
