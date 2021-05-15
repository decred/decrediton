import { FormattedMessage as T } from "react-intl";
import styles from "./Header.module.css";
import { StandaloneHeader } from "layout";
import { GOVERNANCE_ICON } from "constants";
import TabHeader from "../../../GovernancePage/TabHeader/TabHeader";

const Header = React.memo(function Header() {
  return (
    <StandaloneHeader
      title={<T id="agendas.details.title" m="Governance" />}
      description={
        <TabHeader descriptionHeaderClassName={styles.descriptionHeader} />
      }
      iconType={GOVERNANCE_ICON}
    />
  );
});

export default Header;
