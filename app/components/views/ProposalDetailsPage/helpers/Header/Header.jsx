import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import { StandaloneHeader } from "layout";
import { GOVERNANCE_ICON } from "constants";
import styles from "./Header.module.css";

const Header = React.memo(function Header({
  eligibleTicketCount,
  isDarkTheme
}) {
  return (
    <StandaloneHeader
      title={<T id="proposal.details.title" m="Governance" />}
      description={
        <div className={classNames(styles.header, "margin-top-s")}>
          <T id="proposal.details.description" m="Your voting power: " />
          <span
            className={classNames(
              styles.tickets,
              isDarkTheme && styles.dark,
              "margin-left-s"
            )}>
            {eligibleTicketCount}
          </span>
        </div>
      }
      iconType={GOVERNANCE_ICON}
    />
  );
});

export default Header;
