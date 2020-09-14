import PagedTutorial from "./PagedTutorial/PagedTutorial";
import { FormattedMessage as T } from "react-intl";
import { MakeStandardPage as StandardPage } from "./StandardPage/StandardPage";

const Page1 = StandardPage("lifecycle01", "TicketLifecycleTutorialPage01");
const Page2 = StandardPage("lifecycle02", "TicketLifecycleTutorialPage02");
const Page3 = StandardPage("lifecycle03", "TicketLifecycleTutorialPage03");
const Page4 = StandardPage("lifecycle04", "TicketLifecycleTutorialPage04");
const Page5 = StandardPage("lifecycle05", "TicketLifecycleTutorialPage05");
const Page6 = StandardPage("lifecycle06", "TicketLifecycleTutorialPage06");

const TicketLifecycle = () => (
  <PagedTutorial
    title={<T id="tutorial.ticketLifecycle.title" m="Ticket Lifecycle" />}
    pages={[Page1, Page2, Page3, Page4, Page5, Page6]}
  />
);

export default TicketLifecycle;
