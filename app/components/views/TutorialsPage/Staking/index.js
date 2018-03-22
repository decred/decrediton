import { FormattedMessage as T } from "react-intl";
import PagedTutorial from "../PagedTutorial";
import { MakeStandardPage as StandardPage } from "../StandardPage";

const Page1 = StandardPage(
  "staking-01",
  <T id="tutorial.staking.page1" m={`This is Stakey, our mascot!

He represents the best aspects of the Decred network and shows up on all staking-related activities.

Once you stake your coins, you have a say on the continued evolution of the Decred network. You become a stakeholder and can vote on agendas, participate on Politeia and help keep the PoW miners in check.
`} />);

export default (props) => (
  <PagedTutorial
    {...props}
    title={<T id="tutorial.ticketLifecycle.title" m="Ticket Lifecycle" />}
    pages={[ Page1 ]}
  />
);
