import { defineMessages } from "react-intl";

export default defineMessages({
  dayMonthDisplay: {
    id: "charts.dayMonthDisplay",
    defaultMessage: "{value, date, day-short-month}"
  },
  fullDayDisplay: {
    id: "charts.fullDayDisplay",
    defaultMessage: "{value, date}"
  },

  // below are the keys to series/fields in the charts (used to translate
  // each series)
  lockedKey: {
    id: "charts.keys.locked",
    defaultMessage: "Locked",
  },
  availableKey: {
    id: "charts.keys.available",
    defaultMessage: "Available"
  },
  sentKey: {
    id: "charts.keys.sent",
    defaultMessage: "Sent"
  },
  receivedKey: {
    id: "charts.keys.received",
    defaultMessage: "Received"
  },
  votedKey: {
    id: "charts.keys.voted",
    defaultMessage: "Votes"
  },
  ticketKey: {
    id: "charts.keys.ticket",
    defaultMessage: "Ticket Purchases"
  },
  revokedKey: {
    id: "charts.keys.revoked",
    defaultMessage: "Revocations"
  },
  immatureKey: {
    id: "charts.keys.immature",
    defaultMessage: "Immature"
  },
  ticketCountByDay: {
    id: "charts.keys.ticketCountByDay",
    defaultMessage: "Tickets"
  },
  day: {
    id: "charts.keys.day",
    defaultMessage: "Days"
  },
  totalStake: {
    id: "charts.keys.totalStake",
    defaultMessage: "Total Stake"
  },
  stakeRewards: {
    id: "charts.keys.stakeRewards",
    defaultMessage: "Stake Rewards"
  },
  stakeFees: {
    id: "charts.keys.stakeFees",
    defaultMessage: "Stake Fees"
  }
});
