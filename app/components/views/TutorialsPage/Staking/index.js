import { FormattedMessage as T } from "react-intl";
import PagedTutorial from "../PagedTutorial";
import { MakeStandardPage as StandardPage } from "../StandardPage";

const Page1 = StandardPage(
  "staking-01",
  <T id="tutorial.staking.page1" m={`Decred holders can participate in the Staking (Proof-of Stake) process by purchasing tickets. These tickets are used to vote on miners’ Proof-of-Work in order to validate changes to the Decred blockchain, or on governance proposals within the Politeia system.

  Staking to verify PoW is rewarding, as each cast vote receives part of the Decred Block Reward. Typically, five tickets are included in each block, meaning each ticket holder receives 6% of the total block reward.
`}/>);

const Page2 = StandardPage(
  "staking-01",
  <T id="tutorial.staking.page2" m={`When a ticket is purchased, the cost of the ticket is locked in your wallet until the ticket is used to vote, or is revoked. Tickets enter the mempool, then the ticketpool where they are drawn at random to vote. There is a 99.5% probability that a ticket will vote. The average ticket will vote in 28 days, but tickets still in the pool that have not been drawn after 142 days will be revoked. The DCR used to purchase the ticket is released from lockup when it votes or when the ticket is revoked.

  When a proposal is set for a vote in Politeia, a snapshot of the ticket pool will be taken at the time of voting. All tickets will have the right to vote on the proposal in an off chain process.

  As block validation is immutable, decisions made on all voted tickets can be publicly tracked. Active participation in staking helps secure Decred network’s, network, ensure quality Proof-of-Work, and determine the future direction of Decred.
`} />);

export default (props) => (
  <PagedTutorial
    {...props}
    title={<T id="tutorial.ticketLifecycle.title" m="Ticket Lifecycle" />}
    pages={[ Page1, Page2 ]}
  />
);
