import { useMemo } from "react";
import ProposalDetails from "./ProposalDetails";
import { politeiaMarkdownIndexMd } from "./utils";
import { Header } from "./helpers";
import { PoliteiaLoading } from "indicators";
import { StandalonePage } from "layout";
import styles from "./ProposalDetails.module.css";
import { useProposalDetailsPage } from "./hooks";
import { LoadingError } from "shared";

const ProposalDetailsPage = () => {
  const {
    viewedProposalDetails,
    eligibleTicketCount,
    votingStatus,
    getProposalError,
    goBackHistory,
    showPurchaseTicketsPage,
    send,
    linkedProposal
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
              showPurchaseTicketsPage,
              linkedProposal
            }}
          />
        );
      case "failure":
        return (
          <LoadingError
            errorMessageDescription={String(getProposalError)}
            cancelButton={true}
            reload={() => {
              send("RETRY");
            }}
          />
        );
      default:
        return null;
    }
  }, [
    eligibleTicketCount,
    goBackHistory,
    viewedProposalDetails,
    getProposalError,
    votingStatus,
    showPurchaseTicketsPage,
    send,
    linkedProposal
  ]);

  return (
    <StandalonePage
      header={<Header eligibleTicketCount={eligibleTicketCount} />}>
      {stateComponent}
    </StandalonePage>
  );
};

export default ProposalDetailsPage;
