import ProposalsList from "./ProposalsList/ProposalsList";
import PoliteiaDisabled from "./PoliteiaDisabled";
import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink as PiLink } from "shared";
import { TabbedPage, TabbedPageTab as Tab } from "layout";
import { createElement as h } from "react";
import { Button, Tooltip, classNames } from "pi-ui";
import { useProposalsTab } from "./hooks";
import styles from "./ProposalsTab.module.css";

const PageHeader = ({ isTestnet, onRefreshProposals }) => (
  <div className={classNames(styles.header, "is-row")}>
    {/* TODO: wrapp this 'header' in a component same header is used in VotingPrefs.jsx */}
    <div>
      <div className={styles.title}>
        <T id="proposals.community.title" m="Proposals" />
      </div>
      <div className={styles.description}>
        <T
          id="proposals.community.descr"
          m="Voting on community proposals allows you to have a say on how the project treasury is spent.
          Participation in voting requires (PoS) tickets. Proposal creation, discussions and other features are available at {link}"
          values={{
            link: (
              <PiLink className={styles.proposalsLink}>
                proposals.decred.org
              </PiLink>
            )
          }}
        />
      </div>
    </div>
    <div className={styles.links}>
      <PiLink
        className={styles.politeiaButton}
        CustomComponent={Button}
        path="/proposals/new"
        isTestnet={isTestnet}>
        <T id="proposals.community.createLink" m="Create a Proposal" />
      </PiLink>
      <Tooltip
        content={
          <T id="proposals.community.refreshProposals" m="Refresh Proposals" />
        }
        placement="left">
        <div className={styles.refreshProposals} onClick={onRefreshProposals} />
      </Tooltip>
    </div>
  </div>
);

const ListLink = ({ count, children }) => (
  <>
    {children}
    {count ? <span className={styles.linkCount}>{count}</span> : null}
  </>
);

const ProposalsTab = () => {
  const {
    activeVoteCount,
    preVoteCount,
    politeiaEnabled,
    isTestnet,
    tab,
    getTokenAndInitialBatch,
    compareInventory
  } = useProposalsTab();

  if (!politeiaEnabled) {
    return <PoliteiaDisabled {...{ getTokenAndInitialBatch }} />;
  }
  return (
    <TabbedPage
      caret={<div />}
      header={
        <PageHeader {...{ isTestnet, onRefreshProposals: compareInventory }} />
      }>
      <Tab
        path="/governance/proposals/prevote"
        component={h(ProposalsList, { tab })}
        key="preVote"
        link={
          <ListLink count={preVoteCount}>
            <T id="proposals.statusLinks.preVote" m="In Discussion" />
          </ListLink>
        }
      />
      <Tab
        path="/governance/proposals/activevote"
        component={h(ProposalsList, { tab })}
        key="activevote"
        link={
          <ListLink count={activeVoteCount}>
            <T id="proposals.statusLinks.underVote" m="Voting" />
          </ListLink>
        }
      />
      <Tab
        path="/governance/proposals/voted"
        component={h(ProposalsList, { finishedVote: true, tab })}
        key="activevote"
        link={<T id="proposals.statusLinks.voted" m="Finished Voting" />}
      />
      <Tab
        path="/governance/proposals/abandoned"
        component={h(ProposalsList, { tab })}
        key="abandoned"
        link={<T id="proposals.statusLinks.abandoned" m="Abandoned" />}
      />
    </TabbedPage>
  );
};

export default ProposalsTab;
