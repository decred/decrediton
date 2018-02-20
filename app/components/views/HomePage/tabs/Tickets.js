import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import { TicketChart } from "charts";
import { ticketHome } from "connectors";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  totalValueOfLiveTickets,
  earnedStakingReward,
  liveTicketsCount,
  votedTicketsCount,
  ticketDataChart
}) => {
  return (
    <div className="overview-content-wrapper">
      <div className="overview-spendable-locked-wrapper">
        <div className="overview-ticket">
          <div className="overview-ticket-column">
            <Balance
              classNameWrapper="overview-balance-spendable-locked"
              classNameUnit="overview-balance-spendable-locked-unit"
              amount={totalValueOfLiveTickets} />
            <div className="overview-balance-spendable-locked-label">
              <T id="home.totalValueOfLiveTickets" m="Total Value Of Live Tickets" />
            </div>
            <Balance
              classNameWrapper="overview-balance-spendable-locked"
              classNameUnit="overview-balance-spendable-locked-unit"
              amount={earnedStakingReward} />
            <div className="overview-balance-spendable-locked-label">
              <T id="home.earnedStakingReward" m="Earned Staking Reward" />
            </div>
          </div>
          <div className="overview-ticket-column-right">
            <div>{liveTicketsCount}</div>
            <div className="overview-balance-spendable-locked-label">
              <T id="home.liveTicketsCount" m="Current Live Tickets" />
            </div>
            <div>{votedTicketsCount}</div>
            <div className="overview-balance-spendable-locked-label">
              <T id="home.votedTicketsCount" m="Voted Tickets" />
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
