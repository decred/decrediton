import { FormattedMessage as T } from "react-intl";
import PagedTutorial from "../PagedTutorial";
import { MakeStandardPage as StandardPage } from "../StandardPage";

const Page1 = StandardPage(
  "lifecycle-01",
  <T id="tutorial.ticketLifecycle.page1" m={`Purchasing a ticket for PoS is quite simple but what happens to it after you buy it? A ticket will go through a few stages in its lifetime:
`} />);

const Page2 = StandardPage(
  "lifecycle-02",
  <T id="tutorial.ticketLifecycle.page2" m={`1. When a Ticket is purchased, the total cost is it’s Ticket Fee + Ticket Price.

  2. Your ticket enters the mempool. This is where your ticket waits to be mined by PoW miners. Only 20 fresh tickets are mined into each block.
`} />);

const Page3 = StandardPage(
  "lifecycle-03",
  <T id="tutorial.ticketLifecycle.page3" m={`2.A - If your ticket is mined into a block, it becomes an immature ticket. This state lasts for 256 blocks (about 20 hours). During this time the ticket cannot vote. At this point, the ticket fee is non-refundable.

  2.B - If your ticket is not mined, both the Ticket Price and Ticket Fee are returned to the purchasing account.
`} />);

const Page4 = StandardPage(
  "lifecycle-04",
  <T id="tutorial.ticketLifecycle.page4" m={`3. After your ticket matures (256 blocks), it enters the Ticket Pool and is eligible for voting. Average time for most tickets to vote is about 28 days. Any ticket has a 99.5% chance of voting within ~142 days. If, after this time, a ticket has not voted, it expires. You receive a refund on the original Ticket Price.
`}/>);

const Page5 = StandardPage(
  "lifecycle-05",
  <T id="tutorial.ticketLifecycle.page5" m={`4. A ticket may miss its call to vote if the voting wallet does not respond or two valid blocks are found within close proximity of each other. If this happens, you receive a refund on the original Ticket Price.

  5. After a ticket has voted, missed, or expired, the funds (ticket price and subsidy if applicable, minus the fee) will enter immature status for another 256 blocks, after which they are released. If a ticket is missed or expired, a ticket revocation transaction is submitted by the wallet which then frees up the locked ticket price.

  NOTE: Revocations can only be submitted for a corresponding missed ticket. You cannot revoke a ticket until it is missed.
`}/>);

const Page6 = StandardPage(
  "lifecycle-06",
  null);

export default (props) => (
  <PagedTutorial
    {...props}
    title={<T id="tutorial.ticketLifecycle.title" m="Ticket Lifecycle" />}
    pages={[ Page1, Page2, Page3, Page4, Page5, Page6 ]}
  />
);
