import { PoliteiaLoading, NoProposals } from "indicators";
import InfiniteScroll from "react-infinite-scroller";
import ProposalsListItem from "../ProposalsListItem/ProposalsListItem";
import styles from "./ProposalsList.module.css";
import { useProposalsList } from "../hooks";

const ProposalList = ({ finishedVote, tab }) => {
  const { noMoreProposals, state, proposals, send } = useProposalsList(tab);
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
      return proposals[tab] && proposals[tab].length ? (
        <InfiniteScroll
          hasMore={!noMoreProposals}
          loadMore={() => send("FETCH")}
          initialLoad={false}
          useWindow={false}
          threshold={300}>
          <div className={"proposal-list " + (finishedVote && "ended")}>
            {proposals[tab].map((v) => (
              <ProposalsListItem key={v.token} {...v} />
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <NoProposals />
      );
    default:
      return null;
  }
};

export default ProposalList;
