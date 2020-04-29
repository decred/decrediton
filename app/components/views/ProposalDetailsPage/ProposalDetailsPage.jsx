import { useMemo } from "react";
import ProposalDetails from "./ProposalDetails";
import { politeiaMarkdownIndexMd } from "./utils";
import { ProposalError, Header } from "./helpers";
import { PoliteiaLoading } from "indicators";
import { StandalonePage } from "layout";
import styles from "./ProposalDetails.module.css";
import { useProposalDetailsPage } from "./hooks";

const ProposalDetailsPage = () => {
  const {
    viewedProposalDetails,
    eligibleTicketCount,
    votingStatus,
    getProposalError,
    goBackHistory,
    showPurchaseTicketsPage
  } = useProposalDetailsPage();

  const stateComponent = useMemo(() => {
    let text = "";
    switch (votingStatus) {
      case "idle":
        return <></>;
      case "loading":
        return (
          <div className={styles.loadingPage}>
            <PoliteiaLoading />
          </div>
        );
      case "success":
        viewedProposalDetails.files.forEach((f) => {
          if (f.name === "index.md") {
            text += politeiaMarkdownIndexMd(f.payload);
          }
        });
        return (
          <ProposalDetails
            {...{
              text,
              viewedProposalDetails,
              goBackHistory,
              eligibleTicketCount,
              showPurchaseTicketsPage
            }}
          />
        );
      case "failure":
        return <ProposalError error={getProposalError} />;
      default:
        return null;
    }
  }, [
    eligibleTicketCount,
    goBackHistory,
    viewedProposalDetails,
    getProposalError,
    votingStatus,
    showPurchaseTicketsPage
  ]);

  return (
    <StandalonePage
      header={<Header eligibleTicketCount={eligibleTicketCount} />}>
      {stateComponent}
    </StandalonePage>
  );
};

export default ProposalDetailsPage;
