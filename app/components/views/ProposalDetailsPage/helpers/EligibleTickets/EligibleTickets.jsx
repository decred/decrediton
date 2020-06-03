import styles from "./EligibleTickets.module.css";
import { FormattedMessage as T } from "react-intl";

const EligibleTickets = ({ tickets }) => {
  const numOfTickets = tickets.length;
  return (
    <div className={styles.wrapper}>
      <div>
        <T
          id="proposals.detail.wallet.eligible.header"
          m="Tickets eligible for voting: "
        />
        <span>{`${numOfTickets}`} total</span>
      </div>
    </div>
  );
};

/* <div>
          {walletEligibleTickets && (
            <VerticalAccordion
              header={
                <div>
                  <T
                    id="proposals.detail.wallet.eligible.header"
                    m="Wallet Eligible Tickets "
                  />
                </div>
              }
              show={showWalletEligibleTickets}
              onToggleAccordion={() =>
                toggleWalletEligibleTickets(!showWalletEligibleTickets)
              }
              className={styles.walletEligibleTickets}
              headerClassName={styles.walletEligibleTicketsHeader}
              arrowClassName={styles.walletEligibleTicketsArrow}>
              {walletEligibleTickets.map((t, i) => (
                <div
                  className={classNames(
                    "is-row",
                    styles.walletEligibleTicketsRow
                  )}
                  key={`ticket-${i + 1}`}>
                  <div className={styles.walletEligibleTicketsLabel}>
                    <T id="proposals.detail.tickets" m="Ticket " />
                    {i + 1}:{" "}
                  </div>
                  <div>{t.ticket}</div>
                </div>
              ))}
            </VerticalAccordion>
          )}
        </div> */
// TOOD: add proptypes
export default EligibleTickets;
