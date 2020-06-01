import { PoliteiaLoading, NoProposals } from "indicators";
import InfiniteScroll from "react-infinite-scroller";
import ProposalsListItem from "../ProposalsListItem/ProposalsListItem";
import { useProposalsList } from "../hooks";
import styles from "./ProposalsList.module.css";

const ProposalsList = ({ finishedVote, tab }) => {
  const { noMoreProposals, state, proposals, loadMore } = useProposalsList(tab);

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
    default:
      return null;
  }
};

export default ProposalsList;
