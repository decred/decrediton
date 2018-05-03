import PagedTutorial from "../PagedTutorial";
import { FormattedMessage as T } from "react-intl";
import { MakeStandardPage as StandardPage } from "../StandardPage";

const Page1 = StandardPage("lifecycle-01", "TicketLifecycleTutorialPage01");
const Page2 = StandardPage("lifecycle-02", "TicketLifecycleTutorialPage02");
const Page3 = StandardPage("lifecycle-03", "TicketLifecycleTutorialPage03");
const Page4 = StandardPage("lifecycle-04", "TicketLifecycleTutorialPage04");
const Page5 = StandardPage("lifecycle-05", "TicketLifecycleTutorialPage05");
const Page6 = StandardPage("lifecycle-06", "TicketLifecycleTutorialPage06");

export default (props) => (
  <PagedTutorial
    {...props}
    title={<T id="tutorial.ticketLifecycle.title" m="Ticket Lifecycle" />}
    pages={[ Page1, Page2, Page3, Page4, Page5, Page6 ]}
  />
);
