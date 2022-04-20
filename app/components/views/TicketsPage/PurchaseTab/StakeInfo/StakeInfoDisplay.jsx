import {
  VerticalAccordion,
  Balance,
  FormattedRelative,
  Subtitle
} from "shared";
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
  <FormattedNumber value={value} />
);

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
  lastVotedTicket,
  currencyDisplay,
  tsDate
}) => (
  <>
    <Subtitle title={<T id="stake.stackingOverview" m="Staking Overview" />} />
    <VerticalAccordion
      header={
        <div className={styles.area}>
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
            label={<T id="stake.lastVotedTicket" m="Last Ticket Voted" />}
            value={
              lastVotedTicket ? (
                <FormattedRelative
                  value={tsDate(lastVotedTicket.leaveTimestamp)}
                />
              ) : (
                <T id="stake.lastVotedTicket.none" m="None" />
              )
            }
            foot={
              lastVotedTicket && (
                <Link
                  to={`/transactions/history/${lastVotedTicket.txHash}`}
                  className={styles.foot}>
                  <span className={styles.purchaseTicketFoot}>
                    <T
                      id="stake.lastTicketLink"
                      m="{shortHash}... View &rarr;"
                      values={{
                        shortHash: lastVotedTicket.txHash.substr(0, 6)
                      }}
                    />
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
                m="{value} {currency}"
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
                      {currencyDisplay}
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
      className={styles.accordion}
      arrowClassName={styles.accordionArrow}
      activeArrowClassName={styles.activeAccordionArrow}>
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
  </>
);

export default StakeInfoDisplay;
