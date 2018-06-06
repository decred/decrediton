import { MeteredChart } from "charts";
import { myTicketsCharts }  from "connectors";
import { FormattedMessage as T } from "react-intl";
import { StakePoolSelect } from "inputs";

@autobind
class StakePoolStats extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      stakePool: this.props.allStakePoolInfo[0]
    };
  }

  onChangeStakePoolStats(stakePool) {
    this.setState({ stakePool });
  }

  render() {
    const { allStakePoolInfo } = this.props;
    const { stakePool } = this.state;
    const { onChangeStakePoolStats } = this;
    return (
      <Aux>
        <div className="my-tickets-stats-indicators">
          <div className="my-tickets-stats-indicators-row">
            <span className="my-tickets-stats-indicators-title">
              <T id="mytickets.statistics.stakepool.title" m="Stake Pool" />
            </span>
          </div>
          <div className="my-tickets-stats-indicators-row">
            <div className="my-tickets-stats-indicators-label">
              {allStakePoolInfo.length > 0 &&
              <div className="stakepool-unconfigured-select">
                <StakePoolSelect
                  options={allStakePoolInfo}
                  value={stakePool}
                  onChange={onChangeStakePoolStats}
                />
              </div>}
            </div>
          </div>
          <div className="my-tickets-stakepool-stats-row">
            <MeteredChart
              additive={true}
              blueValue={40960}
              blueLabel="All Network Tickets"
              blackValue={stakePool.Live}
              blackLabel="Stakepool Tickets"
            />
          </div>
          <div className="my-tickets-stakepool-stats-row">
            <MeteredChart
              additive={true}
              blueValue={stakePool.Voted}
              blueLabel="Voted Tickets"
              blackValue={stakePool.Missed}
              blackLabel="Missed Tickets"
            />
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
      </Aux>
    );
  }
}

export default myTicketsCharts(StakePoolStats);
