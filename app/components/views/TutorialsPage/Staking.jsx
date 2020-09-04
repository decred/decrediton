import PagedTutorial from "./PagedTutorial/PagedTutorial";
import { FormattedMessage as T } from "react-intl";
import { MakeStandardPage as StandardPage } from "./StandardPage/StandardPage";

const Page1 = StandardPage("staking01", "StakingTutorialPage01");
const Page2 = StandardPage("staking01", "StakingTutorialPage02");

const Staking = () => (
  <PagedTutorial
    title={<T id="tutorial.staking.title" m="Staking" />}
    pages={[Page1, Page2]}
  />
);

export default Staking;
