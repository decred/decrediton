import { VerticalAccordion } from "shared";
import { isImported } from "../utils";
import Header from "../Header";
import styles from "./AccountRowContent.module.css";

const AccountRowContent = ({
  account,
  mixedAccount,
  changeAccount,
  hidden,
  isShowingRenameAccount,
  onToggleShowDetails,
  getAccountDetailsStyles,
  getRenameAccountStyles,
  isShowingDetails,
  hasTickets
}) => (
  <VerticalAccordion
    header={
      <Header
        {...{ account, mixedAccount, changeAccount, hidden, hasTickets }}
      />
    }
    disabled={isImported(account) && !hasTickets}
    onToggleAccordion={onToggleShowDetails}
    show={isShowingDetails}
    arrowClassName={styles.accordionArrow}
    activeArrowClassName={styles.activeAccordionArrow}
    className={styles.details}>
    {isShowingDetails ? (
      isShowingRenameAccount ? (
        getRenameAccountStyles()
      ) : (
        getAccountDetailsStyles()
      )
    ) : (
      <></>
    )}
  </VerticalAccordion>
);

export default AccountRowContent;
