import { VerticalAccordion, Balance } from "shared";
import { FormattedNumber, FormattedMessage as T } from "react-intl";
import StakeInfoDetails from "./StakeInfoDetails";
import { Link } from "react-router-dom";
import styles from "./StakeInfo.module.css";

const StakeInfoDisplayItem = ({ label, value, foot }) => (
  <div className={styles.stakeInfo}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
    <span className={styles.foot}>{foot}</span>
  </div>
);

const StakeInfoDisplayTicketCount = ({ value }) => (
  <T
    id="stake.ticketCount"
    m="{value} {label}"
    values={{
      value: <FormattedNumber value={value} />,
      label: (
        <span className={styles.purchaseTicketLabel}>
          <T
            id="stake.ticketCountLabel"
            m="{label}"
            values={{ label: value == 1 ? "Ticket" : "Tickets" }}
          />
        </span>
      )
    }}
  />
);

const getDateDiffLabel = (targetDate) => {
  const nowMillis = new Date().getTime();
  const targetMillis = targetDate.getTime();
  const duration = Math.abs(targetMillis - nowMillis);
  const years = Math.floor(duration / 3.154e10);
  const months = Math.floor(duration / 2.628e9) % 12;
  const days = Math.floor(
    (duration - years * 3.154e10 - months * 2.628e9) / 8.64e7
  );
  const hours = Math.floor(duration / 3.6e6) % 24;
  const mins = Math.floor(duration / 60000) % 60;
  const secs = Math.floor(duration / 1000) % 60;

  const diff = [
    { value: years, label: "y" },
    { value: months, label: "m" },
    { value: days, label: "d" },
    { value: hours, label: "h" },
    { value: mins, label: "m" },
    { value: secs, label: "s" }
  ];

  for (let i = 0; i < diff.length; i = i + 1) {
    if (diff[i].value) {
      return (
        <T
          id="stake.lastTicketDateDiff"
          m="{value}{label} {value1}{label1} {label2}"
          values={{
            value: <FormattedNumber value={diff[i].value} />,
            label: (
              <span className={styles.purchaseTicketLabel}>
                <T
                  id="stake.lastTicketDiff"
                  m="{label}"
                  values={{ label: diff[i].label }}
                />
              </span>
            ),
            value1:
              i + 1 < diff.length ? (
                <FormattedNumber value={diff[i + 1].value} />
              ) : (
                ""
              ),
            label1:
              i + 1 < diff.length ? (
                <span className={styles.purchaseTicketLabel}>
                  <T
                    id="stake.lastTicketDiff2"
                    m="{label}"
                    values={{ label: diff[i + 1].label }}
                  />
                </span>
              ) : (
                ""
              ),
            label2: (
              <span className={styles.purchaseTicketLabel}>
                <T id="stake.lastTicketAgo" m="ago" />
              </span>
            )
          }}
        />
      );
    }
  }
};

const StakeInfoDisplay = ({
  isShowingDetails,
  ownMempoolTicketsCount,
  unspentTicketsCount,
  immatureTicketsCount,
  liveTicketsCount,
  onToggleStakeinfo,
  ticketPoolSize,
  votedTicketsCount,
  allMempoolTicketsCount,
  missedTicketsCount,
  revokedTicketsCount,
  expiredTicketsCount,
  totalSubsidy,
  isSPV,
  lastVotedTicket
}) => {
  return (
    <VerticalAccordion
      header={
        <div className={styles.area}>
          <div className={styles.purchaseTicketTitle}>
            <T id="stake.stackingOverview" m="Staking Overview" />
          </div>
          {isSPV ? (
            <StakeInfoDisplayItem
              label={<T id="stake.unspentTickets" m="Unspent Tickets" />}
              value={
                <StakeInfoDisplayTicketCount value={unspentTicketsCount} />
              }
            />
          ) : (
            <StakeInfoDisplayItem
              label={<T id="stake.liveTickets" m="Live" />}
              value={<StakeInfoDisplayTicketCount value={liveTicketsCount} />}
              foot={
                <T
                  id="stake.liveTicketsFoot"
                  m="Own Mempool: {ownMempoolTickets}       Immature: {immatureTickets }"
                  values={{
                    ownMempoolTickets: (
                      <FormattedNumber value={ownMempoolTicketsCount} />
                    ),
                    immatureTickets: (
                      <FormattedNumber value={immatureTicketsCount} />
                    )
                  }}
                />
              }
            />
          )}
          <StakeInfoDisplayItem
            label={<T id="stakeSPV.totalVotedTickets" m="Total Voted" />}
            value={<StakeInfoDisplayTicketCount value={votedTicketsCount} />}
          />
          <StakeInfoDisplayItem
            label={<T id="stake.lastVotedTicket" m="Last Ticked Voted" />}
            value={
              lastVotedTicket
                ? getDateDiffLabel(new Date(lastVotedTicket.leaveTimestamp * 1000))
                : "None"
            }
            foot={
              lastVotedTicket && (
                <Link
                  to={`/transactions/history/${lastVotedTicket.txHash}`}
                  className={styles.foot}>
                  <span className={styles.purchaseTicketFoot}>
                    {lastVotedTicket.txHash.substr(0, 6) + "... "}
                    <T id="stake.lastTicketLink" m="View &rarr;" />
                  </span>
                </Link>
              )
            }
          />
          <StakeInfoDisplayItem
            label={<T id="stake.totalRewards" m="Total Rewards Earned" />}
            value={
              <T
                id="stake.totalRewardsValue"
                m="{value}{currency}"
                values={{
                  value: (
                    <Balance
                      hideCurrency
                      noSmallAmount
                      classNameWrapper={styles.balance}
                      amount={totalSubsidy}
                    />
                  ),
                  currency: (
                    <span className={styles.purchaseTicketLabel}>
                      <T id="stake.dcr" m=" DCR" />
                    </span>
                  )
                }}
              />
            }
          />
        </div>
      }
      show={isShowingDetails}
      onToggleAccordion={onToggleStakeinfo}
      className={"detailsAccordion"}>
      <StakeInfoDetails
        {...{
          ticketPoolSize,
          votedTicketsCount,
          allMempoolTicketsCount,
          missedTicketsCount,
          revokedTicketsCount,
          expiredTicketsCount,
          immatureTicketsCount,
          ownMempoolTicketsCount,
          liveTicketsCount,
          totalSubsidy,
          isSPV
        }}
      />
    </VerticalAccordion>
  );
};

export default StakeInfoDisplay;
