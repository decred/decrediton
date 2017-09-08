import React from "react";
import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";
import { StakePoolStyles } from "../views/ViewStyles";

const StakePoolsList = ({
  configuredStakePools,
  unconfiguredStakePools,
  onShowAddStakePool,
  onHideStakePoolConfig
}) => (
  <div style={StakePoolStyles.content}>
    <div style={StakePoolStyles.flexHeight}>
      <div style={StakePoolStyles.contentNestFromAddress}>
        <div style={StakePoolStyles.contentNestPrefixConfigured}>Configured stake pools:</div>
      </div>
      <div id="dynamicInput">
        {configuredStakePools.map(({
          value: { Host, TicketAddress, PoolFees, Script }}
        ) => (
          <div key={Host} style={StakePoolStyles.contentNestStakePool}>
            <div style={StakePoolStyles.contentNestStakePoolSettings}>
              <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>URL:</div>
              <div style={StakePoolStyles.contentNestContentStakePoolSettings}>{Host}</div>
            </div>
            <div style={StakePoolStyles.contentNestStakePoolSettings}>
              <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>Ticket Address:</div>
              <div style={StakePoolStyles.contentNestContentStakePoolSettings}>{TicketAddress}</div>
            </div>
            <div style={StakePoolStyles.contentNestStakePoolSettings}>
              <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>Script:</div>
              <textarea disabled value={Script} style={StakePoolStyles.contentNestContentStakePoolSettings}/>
            </div>
            <div style={StakePoolStyles.contentNestStakePoolSettingsBottom}>
              <div style={StakePoolStyles.contentNestPrefixStakePoolSettings}>Pool Fees:</div>
              <div style={StakePoolStyles.contentNestContentStakePoolSettings}>{PoolFees}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {unconfiguredStakePools.length > 0 ? (
      <KeyBlueButton style={StakePoolStyles.contentSend} onClick={onShowAddStakePool}>
        Add stakepool
      </KeyBlueButton>
    ) : null}
    <SlateGrayButton
      style={StakePoolStyles.hideStakePoolConfig}
      onClick={onHideStakePoolConfig}
    >Cancel</SlateGrayButton>
  </div>
);

export default StakePoolsList;
