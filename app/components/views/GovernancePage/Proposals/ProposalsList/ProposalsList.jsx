import { PoliteiaLoading, NoProposals } from "indicators";
import InfiniteScroll from "react-infinite-scroller";
import ProposalsListItem from "../ProposalsListItem/ProposalsListItem";
import { useProposalsList } from "../hooks";
import { useEffect } from "react";
import styles from "./ProposalsList.module.css";

const ProposalsList = ({ finishedVote, tab }) => {
  const {
    noMoreProposals,
    state,
    proposals,
    loadMore,
    messagesEndRef
  } = useProposalsList(tab);

  // useEffect(() => {
  //   console.log("SCROLLL1111  ", messagesEndRef.current)
  //   if (messagesEndRef.current){
  //     console.log("SCROLLLLLLLLLL")
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messagesEndRef.current]);

  switch (state.value) {
    case "idle":
      return <NoProposals />;
    // case "loading":
    //   return (
    //     <div className={styles.loadingPage}>
    //       <PoliteiaLoading center />
    //     </div>
    //   );
    case "loading":
    case "success":
      return proposals[tab] && proposals[tab].length ? (
        <>
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
          {state.value == "loading" && (
            <div className={styles.loadingPage}>
              <PoliteiaLoading center />
            </div>
          )}
        </>
      ) : (
        <NoProposals />
      );
    default:
      return null;
  }
};

export default ProposalsList;
