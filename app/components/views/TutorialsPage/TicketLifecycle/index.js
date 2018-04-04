import { FormattedMessage as T } from "react-intl";
import PagedTutorial from "../PagedTutorial";
import { MakeStandardPage as StandardPage } from "../StandardPage";

const Page1 = StandardPage(
  "lifecycle-01",
  <T id="tutorial.ticketLifecycle.page1" m={`Purchasing a ticket for PoS is quite simple but what happens to it after you buy it? A ticket will go through a few stages in its lifetime:
`} />);

const Page2 = StandardPage(
  "lifecycle-02",
  <T id="tutorial.ticketLifecycle.page2" m={`When a Ticket is purchased, the total cost is its Ticket Fee + Ticket Price. The price is dynamic in order to yield a ticket pool of approximately 40,960 tickets.

  Your ticket enters the mempool. Up to 20 tickets are mined into each block, prioritized by the ticket fee.
`} />);

const Page3 = StandardPage(
  "lifecycle-03",
  <T id="tutorial.ticketLifecycle.page3" m={`Two things might happen next:

  A - Your ticket is mined into a block and it becomes an immature ticket. This state lasts for 256 blocks (about 20 hours). During this time, the ticket cannot vote and the ticket fee becomes non-refundable.

  B - If your ticket is not mined, it will stay in the mempool until the ticket price increases or the block height hits your ticket expiration date. At this point, both the Ticket Price and Ticket Fee are returned.
`} />);

const Page4 = StandardPage(
  "lifecycle-04",
  <T id="tutorial.ticketLifecycle.page4" m={`When your ticket matures (256 blocks), it enters the Ticket Pool and can be selected to vote. For each new block, five tickets are deterministically and pseudorandomly selected to vote on the newly mined block. The average ticket is selected to vote in approximately 28 days, and any ticket has a 99.5% chance of voting within ~142 days. If, after this time a ticket has not voted, it expires and the original Ticket Price is refunded.
`}/>);

const Page5 = StandardPage(
  "lifecycle-05",
  <T id="tutorial.ticketLifecycle.page5" m={`You must be connected to the network to cast a vote, which is why many people use stakepools. If your ticket is called and it misses the vote, you receive a refund on the original Ticket Price.

  After a ticket has voted, missed, or expired, the funds (ticket price minus the fee) will enter immature status for another 256 blocks, after which they are released from lockup in the wallet. If a ticket is missed or expired, a ticket revocation transaction is submitted by the wallet to free up the locked ticket price.

  NOTE: Revocations can only be submitted for a corresponding missed ticket. You cannot revoke a ticket until it is missed.
`}/>);

const Page6 = StandardPage(
  "lifecycle-06",
  <T id="tutorial.ticketLifecycle.page6" m={`You should now understand a bit better the lifecycle of a ticket, so start staking your Decred and participate on the community!
`}/>);

export default (props) => (
  <PagedTutorial
    {...props}
    title={<T id="tutorial.ticketLifecycle.title" m="Ticket Lifecycle" />}
    pages={[ Page1, Page2, Page3, Page4, Page5, Page6 ]}
  />
);
