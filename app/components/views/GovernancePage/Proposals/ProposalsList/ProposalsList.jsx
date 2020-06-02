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
    send
  } = useProposalsList(tab);
  switch (state.value) {
    case "idle":
      return <NoProposals />;
    case "loading":
    case "success":
      return (
        <>
          {proposals && proposals[tab] && proposals[tab].length ? (
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
          )}
          {state.value == "loading" && (
            <div className={styles.loadingPage}>
              <PoliteiaLoading center />
            </div>
          )}
        </>
      );
    case "failure":
      return (
        <LoadingError
          errorMessageDescription={String(getProposalError)}
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
