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
        <div className="overview-spendable-locked-wrapper-area tickets">
          <div className="overview-spendable-locked-wrapper-row">
            <div className="overview-balance-spendable-locked active">{liveTicketsCount}</div>
            <div className="overview-balance-spendable-locked-top-label">
              <T id="home.liveTicketsCount" m="active tickets" />
            </div>
          </div>
          <div className="overview-spendable-locked-wrapper-row">
            <div className="overview-balance-spendable-locked-text">
              <T id="home.totalValueOfLiveTickets" m="With a total value of" />
            </div>
            <Balance
              flat
              classNameWrapper="header-small-balance overview-balance-spendable-locked"
              classNameUnit="overview-balance-spendable-locked-unit"
              amount={totalValueOfLiveTickets} />
          </div>
        </div>
        <div className="overview-spendable-locked-wrapper-area">
          <div className="overview-spendable-locked-wrapper-row">
            <div className="overview-balance-spendable-locked voted">{votedTicketsCount}</div>
            <div className="overview-balance-spendable-locked-top-label">
              <T id="home.votedTicketsCount" m="voted tickets" />
            </div>
          </div>
          <div className="overview-spendable-locked-wrapper-row">
            <div className="overview-balance-spendable-locked-text">
              <T id="home.earned" m="Earned" />
            </div>
            <Balance
              flat
              classNameWrapper="header-small-balance overview-balance-spendable-locked"
              classNameUnit="overview-balance-spendable-locked-unit"
              amount={earnedStakingReward} />
            <div className="overview-balance-spendable-locked-text back">
              <T id="home.stakingRewards" m="in staking rewards" />
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
