import React from "react";
import { autobind } from "core-decorators";
import { substruct } from "../../fp";
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

  onChangeSelectedUnconfigured(selectedUnconfigured) {
    this.setState({ selectedUnconfigured });
  }

  onShowAddStakePool() {
    this.setState({ isAdding: false });
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
    const { apiKey, selectedUnconfigured: pool, onSetStakePoolInfo: onSetInfo } = this.state;
    apiKey ? (onSetInfo && onSetInfo(privpass, pool.Host, apiKey, 0)) : null;
  }
}

export default stakePools(StakePools);
