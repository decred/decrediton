import { PoliteiaLoading, NoProposals } from "indicators";
import InfiniteScroll from "react-infinite-scroller";
import ProposalsListItem from "../ProposalsListItem";
import { useProposalsList } from "../hooks";
import { LoadingError } from "shared";
import styles from "./ProposalsList.module.css";
import {
  useCallback,
  useLayoutEffect,
  useState,
  useEffect,
  useMemo
} from "react";
import { EyeFilterMenu } from "buttons";
import { FormattedMessage as T } from "react-intl";

const getProposalTypes = () => [
  {
    key: "finishedVote",
    label: <T id="proposals.statusLinks.allFinishedVote" m="All" />
  },
  {
    key: "approvedVote",
    label: <T id="proposals.statusLinks.approvedVote" m="Approved" />
  },
  {
    key: "rejectedVote",
    label: <T id="proposals.statusLinks.rejectedVote" m="Rejected" />
  }
];

const ProposalsList = ({ finishedVote, tab, tabStatuses }) => {
  const [selectedFilter, setSelectedFilter] = useState(tab);
  const {
    getProposalError,
    inventoryError,
    loadMore,
    noMoreProposals,
    proposals,
    state,
    send
  } = useProposalsList(selectedFilter);

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

  const proposalsList = useMemo(
    () =>
      tabStatuses.reduce((acc, status) => [...acc, ...proposals[status]], []),
    [tabStatuses, proposals]
  );

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
      return proposals && proposalsList && proposalsList.length ? (
        <>
          {tab === "finishedVote" && (
            <div className={styles.filters}>
              <EyeFilterMenu
                options={getProposalTypes()}
                selected={selectedFilter}
                onChange={(type) => setSelectedFilter(type.key)}
              />
            </div>
          )}
          <div ref={ref} className={styles.scrollWrapper}>
            <InfiniteScroll
              hasMore={!noMoreProposals}
              loadMore={loadMore}
              initialLoad={false}
              useWindow={false}
              threshold={300}>
              <div className={styles.proposalList}>
                {proposalsList.map((v) => (
                  <ProposalsListItem
                    key={v.token}
                    {...v}
                    finishedVote={finishedVote}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </>
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
