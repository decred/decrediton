import { MeteredChart } from "charts";
import { myTicketsCharts }  from "connectors";
import { FormattedMessage as T } from "react-intl";

class VoteTimeChartPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return ({
      selectedStakePool: null
    });
  }

  render() {
    const { stakePools } = this.props;
    const { selectedStakePool } = this.state;
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
              <div className="stakepool-unconfigured-select">
              </div>
            </div>
          </div>
          <div className="my-tickets-stakepool-stats-row">
            <MeteredChart
              additive={true}
              blueValue={40960}
              blueLabel="All Network Tickets"
              blackValue={6000}
              blackLabel="Stakepool Tickets"
            />
          </div>
          <div className="my-tickets-stakepool-stats-row">
            <MeteredChart
              additive={true}
              blueValue={4000}
              blueLabel="Voted Tickets"
              blackValue={20}
              blackLabel="Missed Tickets"
            />
          </div>
          <div className="my-tickets-stakepool-stats-row">
            <MeteredChart
              additive={true}
              blueValue={519}
              blueLabel="Revoked Tickets"
              blackValue={323}
              blackLabel="Expired Tickets"
            />
          </div>
          <div className="my-tickets-stakepool-stats-row">
            <MeteredChart
              additive={true}
              blueValue={102}
              blueLabel="Active Users"
              blackValue={321}
              blackLabel="Total Users"
            />
          </div>
        </div>
      </Aux>
    );
  }
}

export default myTicketsCharts(VoteTimeChartPage);
