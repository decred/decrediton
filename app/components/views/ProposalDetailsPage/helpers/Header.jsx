import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader } from "layout";

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
      iconClassName="governance"
    />
  );
});

export default Header;
