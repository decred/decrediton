import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader } from "layout";
import { GOVERNANCE_ICON } from "constants";

const Header = React.memo(function Header({ eligibleTicketCount }) {
  return (
    <StandaloneHeader
      title={<T id="proposal.details.title" m="Governance" />}
      description={
        <T
          id="proposal.details.description"
          m={"Your voting power: {votingPower}"}
          values={{ votingPower: eligibleTicketCount }}
        />
      }
      iconType={GOVERNANCE_ICON}
    />
  );
});

export default Header;
