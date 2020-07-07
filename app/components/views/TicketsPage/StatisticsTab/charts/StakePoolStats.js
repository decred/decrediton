import { MeteredChart } from "charts";
import { myTicketsCharts } from "connectors";
import { FormattedMessage as T } from "react-intl";
import { LEGACY_StakePoolSelect } from "inputs";
import { Tooltip } from "shared";

@autobind
class StakePoolStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    let stakePool = this.props.allStakePoolStats[0];
    if (this.props.selectedStakePool) {
      const idxSel = this.props.allStakePoolStats.findIndex(
        (s) => s.Host === this.props.selectedStakePool.Host
      );
      if (idxSel > -1) {
        stakePool = this.props.allStakePoolStats[idxSel];
      }
    }

    return {
      stakePool: stakePool
    };
  }

  onChangeStakePoolStats(stakePool) {
    this.setState({ stakePool });
  }

  render() {
    const { allStakePoolStats, ticketPoolSize } = this.props;
    const { stakePool } = this.state;
    const { onChangeStakePoolStats } = this;
    const ticketPercentage = stakePool ? stakePool.ProportionLive * 100 : 0;
    const votedPercentage = stakePool ? stakePool.ProportionMissed * 100 : 0;

    return (
      <>
        <div className="my-tickets-stats-indicators">
          <div className="my-tickets-stats-indicators-row">
            <span className="my-tickets-stats-indicators-title">
              <T id="mytickets.statistics.stakepool.title" m="VSP" />
            </span>
          </div>
          <div className="my-tickets-stakepool-stats-selector-row">
            <div className="stakepool-unconfigured-select">
              {/* TODO change this select to VSPSelect.jsx */}
              <LEGACY_StakePoolSelect
                options={allStakePoolStats}
                value={stakePool}
                onChange={onChangeStakePoolStats}
              />
            </div>
          </div>
          <div className="my-tickets-stakepool-stats-row">
            <Tooltip
              text={
                <T
                  id="mytickets.statistics.stakepool.ticketsTip"
                  m="{percentage}% proportion of network tickets"
                  values={{ percentage: ticketPercentage.toFixed(1) }}
                />
              }>
              <MeteredChart
                additive={true}
                blueValue={ticketPoolSize}
                blueLabel={
                  <T
                    id="mytickets.statistics.stakepool.networkTickets"
                    m="All Network Tickets"
                  />
                }
                blackValue={stakePool.Live}
                blackLabel={
                  <T
                    id="mytickets.statistics.stakepool.stakepoolTickets"
                    m="VSP Tickets"
                  />
                }
              />
            </Tooltip>
          </div>
          <div className="my-tickets-stakepool-stats-row">
            <Tooltip
              text={
                <T
                  id="mytickets.statistics.stakepool.votedTip"
                  m="{percentage}% of tickets missed"
                  values={{ percentage: votedPercentage.toFixed(1) }}
                />
              }>
              <MeteredChart
                additive={true}
                blueValue={stakePool.Voted}
                blueLabel="Voted Tickets"
                blackValue={stakePool.Missed}
                blackLabel="Missed Tickets"
              />
            </Tooltip>
          </div>
          <div className="my-tickets-stakepool-stats-row">
            <MeteredChart
              additive={true}
              blueValue={stakePool.UserCountActive}
              blueLabel="Active Users"
              blackValue={stakePool.UserCount}
              blackLabel="Total Users"
            />
          </div>
        </div>
      </>
    );
  }
}

export default myTicketsCharts(StakePoolStats);
