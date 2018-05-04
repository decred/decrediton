import PagedTutorial from "../PagedTutorial";
import { FormattedMessage as T } from "react-intl";
import { MakeStandardPage as StandardPage } from "../StandardPage";

const Page1 = StandardPage("staking-01", "StakingTutorialPage01");
const Page2 = StandardPage("staking-01", "StakingTutorialPage02");

export default (props) => (
  <PagedTutorial
    {...props}
    title={<T id="tutorial.ticketLifecycle.title" m="Ticket Lifecycle" />}
    pages={[ Page1, Page2 ]}
  />
);
