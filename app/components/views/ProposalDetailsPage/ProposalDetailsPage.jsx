import { useMemo } from "react";
import ProposalDetails from "./ProposalDetails";
import { Header } from "./helpers";
import { PoliteiaLoading } from "indicators";
import { StandalonePage } from "layout";
import styles from "./ProposalDetails.module.css";
import { useProposalDetailsPage } from "./hooks";
import { LoadingError } from "shared";

const ProposalDetailsPage = () => {
  const {
    viewedProposalDetails,
    votingStatus,
    getProposalError,
    goBackHistory,
    showPurchaseTicketsPage,
    send,
    linkedProposal,
    isDarkTheme
  } = useProposalDetailsPage();
  const { eligibleTicketCount } = viewedProposalDetails || {};

  const stateComponent = useMemo(() => {
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
        return (
          <ProposalDetails
            {...{
              viewedProposalDetails,
              goBackHistory,
              showPurchaseTicketsPage,
              linkedProposal,
              isDarkTheme
            }}
          />
        );
      case "failure":
        return (
          <LoadingError
            errorMessageDescription={String(getProposalError)}
            cancelButton
            reload={() => send("RETRY")}
          />
        );
      default:
        return null;
    }
  }, [
    goBackHistory,
    viewedProposalDetails,
    getProposalError,
    votingStatus,
    showPurchaseTicketsPage,
    send,
    linkedProposal,
    isDarkTheme
  ]);

  return (
    <StandalonePage
      header={<Header {...{ eligibleTicketCount, isDarkTheme }} />}>
      {stateComponent}
    </StandalonePage>
  );
};

export default ProposalDetailsPage;
