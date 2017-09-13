import React from "react";
import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";
import "../../style/Layout.less";
import "../../style/StakePool.less";

const StakePoolsList = ({
  configuredStakePools,
  unconfiguredStakePools,
  onShowAddStakePool,
  onHideStakePoolConfig
}) => (
  <div className="page-content">
    <div className="stakepool-flex-height">
      <div className="stakepool-content-nest-from-address">
        <div className="stakepool-content-nest-prefix-configured">Configured stake pools:</div>
      </div>
      <div id="dynamicInput">
        {configuredStakePools.map(({
          value: { Host, TicketAddress, PoolFees, Script }}
        ) => (
          <div key={Host} className="stakepool-content-nest-stake-pool">
            <div className="stakepool-content-nest-settings">
              <div className="stakepool-content-nest-prefix-settings">URL:</div>
              <div className="stakepool-content-nest-content-settings">{Host}</div>
            </div>
            <div className="stakepool-content-nest-settings">
              <div className="stakepool-content-nest-prefix-settings">Ticket Address:</div>
              <div className="stakepool-content-nest-content-settings">{TicketAddress}</div>
            </div>
            <div className="stakepool-content-nest-settings">
              <div className="stakepool-content-nest-prefix-settings">Script:</div>
              <textarea disabled value={Script} className="stakepool-content-nest-content-settings"/>
            </div>
            <div className="stakepool-content-nest-settings-bottom">
              <div className="stakepool-content-nest-prefix-settings">Pool Fees:</div>
              <div className="stakepool-content-nest-content-settings">{PoolFees}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {unconfiguredStakePools.length > 0 ? (
      <KeyBlueButton className="stakepool-content-send" onClick={onShowAddStakePool}>
        Add stakepool
      </KeyBlueButton>
    ) : null}
    <SlateGrayButton
      className="stakepool-hide-config"
      onClick={onHideStakePoolConfig}
    >Cancel</SlateGrayButton>
  </div>
);

export default StakePoolsList;
