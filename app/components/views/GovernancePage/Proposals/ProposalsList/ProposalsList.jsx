import { PoliteiaLoading, NoProposals } from "indicators";
import InfiniteScroll from "react-infinite-scroller";
import ProposalsListItem from "../ProposalsListItem/ProposalsListItem";
import { useProposalsList } from "../hooks";
import { LoadingError } from "shared";
import styles from "./ProposalsList.module.css";

const ProposalsList = ({ finishedVote, tab }) => {
  const {
    noMoreProposals,
    state,
    proposals,
    loadMore,
    getProposalError,
    inventoryError,
    send
  } = useProposalsList(tab);

  switch (state.value) {
    case "idle":
      return <NoProposals />;
    case "loading":
      return (
        <div className={styles.loadingPage}>
          <PoliteiaLoading center />
        </div>
      );
    case "success":
      return proposals && proposals[tab] && proposals[tab].length ? (
        <InfiniteScroll
          hasMore={!noMoreProposals}
          loadMore={loadMore}
          initialLoad={false}
          useWindow={false}
          threshold={300}>
          <div className={styles.proposalList}>
            {proposals[tab].map((v) => (
              <ProposalsListItem
                key={v.token}
                {...v}
                finishedVote={finishedVote}
              />
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <NoProposals />
      );
    case "failure":
      return (
        <LoadingError
          errorMessageDescription={String(getProposalError || inventoryError)}
          cancelButton={false}
          reload={() => {
            send("RETRY");
          }}
        />
      );
    default:
      return null;
  }
};

export default ProposalsList;
