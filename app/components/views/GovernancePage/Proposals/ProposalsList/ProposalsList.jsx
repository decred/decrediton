import { PoliteiaLoading, NoProposals } from "indicators";
import InfiniteScroll from "react-infinite-scroller";
import ProposalsListItem from "../ProposalsListItem/ProposalsListItem";
import { useProposalsList } from "../hooks";
import { LoadingError } from "shared";
import styles from "./ProposalsList.module.css";
import { useCallback, useLayoutEffect, useState, useEffect } from "react";
import ProposalsFilter from "../ProposalsFilter/ProposalsFilter";

const ProposalsList = ({ finishedVote, tab }) => {
  const [filterTab, setFilterTab] = useState(tab);
  const {
    getProposalError,
    inventoryError,
    loadMore,
    noMoreProposals,
    proposals,
    state,
    send
  } = useProposalsList(filterTab);

  const handleSetFilterTab = (tab) => {
    setFilterTab(tab);
  };

  // This part of the code is meant to solve the situation when the window
  // is too tall, and the user can not trigger `loadMore` with scrolling.
  // It calls automatically `loadMore` if there are more proposals to show
  // and the window is not scrollable.
  const [node, setNode] = useState();
  const ref = useCallback((node) => {
    setNode(node);
  }, []);
  const [isScrollable, setIsScrollable] = useState(true);
  useLayoutEffect(() => {
    if (!node) return;
    setIsScrollable(node.scrollHeight > node.clientHeight);
  }, [node]);

  useEffect(() => {
    if (!node) return;
    if (!isScrollable && !noMoreProposals) {
      loadMore();
    }
  }, [isScrollable, noMoreProposals, node, loadMore]);

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
      return proposals &&
        proposals[filterTab] &&
        proposals[filterTab].length ? (
        <div
          ref={ref}
          style={{
            height: "100%",
            overflow: "auto"
          }}>
          {tab === "finishedVote" && (
            <ProposalsFilter
              filterTab={filterTab}
              setFilterTab={handleSetFilterTab}
            />
          )}
          <InfiniteScroll
            hasMore={!noMoreProposals}
            loadMore={loadMore}
            initialLoad={false}
            useWindow={false}
            threshold={300}>
            <div className={styles.proposalList}>
              {proposals[filterTab].map((v) => (
                <ProposalsListItem
                  key={v.token}
                  {...v}
                  finishedVote={finishedVote}
                />
              ))}
            </div>
          </InfiniteScroll>
        </div>
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
