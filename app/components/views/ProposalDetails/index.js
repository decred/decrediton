import { useMemo } from "react";
import ProposalDetails from "./ProposalDetails";
import { ProposalError, politeiaMarkdownIndexMd } from "./helpers";
import { PoliteiaLoading } from "indicators";
import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import styles from "./ProposalDetails.module.css";
import { useProposalDetailsPage } from "./hooks";

const Header = React.memo(function Header({ eligibleTicketCount }) {
  return (<StandaloneHeader
    title={<T id="proposal.details.title" m="Governance" />}
    description={<T id="proposal.details.description"
      m={"Your voting power: {votingPower}"}
      values={{ votingPower: eligibleTicketCount }}
    />}
    iconClassName="governance"
  />);
});

function ProposalDetailsPage() {
  const { votingStatus, getProposalError, proposalsDetails, token, goBackHistory, showPurchaseTicketsPage } = useProposalDetailsPage();

  const viewedProposalDetails = proposalsDetails[token];
  const eligibleTicketCount = viewedProposalDetails && viewedProposalDetails.walletEligibleTickets ?
    proposalsDetails[token].walletEligibleTickets.length : 0;

  const stateComponent = useMemo(() => {
    let text = "";
    switch (votingStatus) {
    case "idle":
      return <></>;
    case "loading":
      return <div className={styles.loadingPage}><PoliteiaLoading /></div>;
    case "success":
      viewedProposalDetails.files.forEach(f => {
        if (f.name === "index.md") {
          text += politeiaMarkdownIndexMd(f.payload);
        }
      });
      return <ProposalDetails {...{ text, viewedProposalDetails, goBackHistory, eligibleTicketCount, showPurchaseTicketsPage }} />;
    case "failure":
      return <ProposalError error={getProposalError} />;
    default:
      return null;
    }
  }, [ eligibleTicketCount, goBackHistory, viewedProposalDetails, getProposalError, votingStatus, showPurchaseTicketsPage ]);

  return (
    <StandalonePage header={<Header eligibleTicketCount={eligibleTicketCount} /> }>
      {stateComponent}
    </StandalonePage>
  );

}

export default ProposalDetailsPage;
