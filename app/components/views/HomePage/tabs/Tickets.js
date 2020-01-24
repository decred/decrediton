import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import { TicketChart } from "charts";
import { ticketHome } from "connectors";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  totalValueOfLiveTickets,
  earnedStakingReward,
  activeTicketsCount,
  votedTicketsCount,
  ticketDataChart
}) => {
  return (
    <div className="overview-content-wrapper">
      <div className="overview-spendable-locked-wrapper">
        <div className="overview-spendable-locked-wrapper-area tickets">
          <div className="is-row">
            <div className="overview-balance-spendable-locked active">
              <T id="home.activeTicketsCount" m="{count, plural, one {{fmtCount} active ticket} other {{fmtCount} active tickets}}"
                values={{
                  count: activeTicketsCount,
                  fmtCount: <span className="count">{activeTicketsCount}</span>
                }} />
            </div>
          </div>
          <div className="is-row">
            <div className="overview-balance-spendable-locked-text">
              <T id="home.totalValueOfActiveTickets" m="With a total value of {value}"
                values={{ value: <Balance
                  flat
                  classNameWrapper="header-small-balance overview-balance-spendable-locked"
                  classNameUnit="overview-balance-spendable-locked-unit"
                  amount={totalValueOfLiveTickets} />
                }} />
            </div>
          </div>
        </div>
        <div className="overview-spendable-locked-wrapper-area">
          <div className="is-row">
            <div className="overview-balance-spendable-locked voted">
              <T id="home.votedTicketsCount" m="{count, plural, one {{fmtCount} voted ticket} other {{fmtCount} voted tickets}}"
                values={{
                  count: votedTicketsCount,
                  fmtCount: <span className="count">{votedTicketsCount}</span>
                }} />
            </div>
          </div>
          <div className="is-row">
            <div className="overview-balance-spendable-locked-text">
              <T id="home.earned" m="Earned {value} in staking rewards"
                values={{
                  value: <Balance
                    flat
                    classNameWrapper="header-small-balance overview-balance-spendable-locked"
                    classNameUnit="overview-balance-spendable-locked-unit"
                    amount={earnedStakingReward} />
                }} />
            </div>
          </div>
        </div>
      </div>
      <div className="overview-ticket-chart-wrapper">
        <TicketChart data={ticketDataChart}/>
      </div>
    </div>
  );
};

export default ticketHome(HomePage);
