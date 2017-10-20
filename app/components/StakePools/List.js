import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage as T } from "react-intl";
import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";
import "../../style/Layout.less";
import "../../style/StakePool.less";

const StakePoolsList = ({
  configuredStakePools,
  unconfiguredStakePools,
  onShowAddStakePool,
  onHideStakePoolConfig,
  rescanRequest
}) => (
  <div>
    <div className="stakepool-flex-height">
      <div className="stakepool-content-nest-from-address">
        <div className="stakepool-content-nest-prefix-configured"><T id="stakepools.list.title" m="Configured stake pools:" /></div>
      </div>
      <div id="dynamicInput">
        {configuredStakePools.map(({
          value: { Host, TicketAddress, PoolFees, Script }}
        ) => (
          <div key={Host} className="stakepool-content-nest-stake-pool">
            <div className="stakepool-content-nest-settings">
              <div className="stakepool-content-nest-prefix-settings"><T id="stakepools.list.form.field.url" m="URL:" /></div>
              <div className="stakepool-content-nest-content-settings">{Host}</div>
            </div>
            <div className="stakepool-content-nest-settings">
              <div className="stakepool-content-nest-prefix-settings"><T id="stakepools.list.form.field.ticketaddress" m="Ticket Address:" /></div>
              <div className="stakepool-content-nest-content-settings">{TicketAddress}</div>
            </div>
            <div className="stakepool-content-nest-settings">
              <div className="stakepool-content-nest-prefix-settings"><T id="stakepools.list.form.field.script" m="Script:" /></div>
              <textarea disabled value={Script} className="stakepool-content-nest-content-settings"/>
            </div>
            <div className="stakepool-content-nest-settings-bottom">
              <div className="stakepool-content-nest-prefix-settings"><T id="stakepools.list.form.field.poolfees" m="Pool Fees:" /></div>
              <div className="stakepool-content-nest-content-settings">{PoolFees}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {unconfiguredStakePools.length > 0 ? (
      <KeyBlueButton className="stakepool-content-send" disabled={rescanRequest} onClick={onShowAddStakePool}>
        <T id="stakepools.list.form.submit" m="Add stakepool" />
      </KeyBlueButton>
    ) : null}
    <SlateGrayButton
      className="stakepool-hide-config"
      onClick={onHideStakePoolConfig}
    ><T id="stakepools.list.form.cancel" m="Cancel" /></SlateGrayButton>
  </div>
);

StakePoolsList.propTypes = {
  configuredStakePools: PropTypes.array.isRequired,
  unconfiguredStakePools: PropTypes.array.isRequired,
  onShowAddStakePool: PropTypes.func.isRequired,
  onHideStakePoolConfig: PropTypes.func.isRequired,
};

export default StakePoolsList;
