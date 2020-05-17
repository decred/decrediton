import ProposalList from "./ProposalsList/ProposalsList";
import PoliteiaDisabled from "./PoliteiaDisabled";
import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink as PiLink } from "shared";
import { TabbedPage, TabbedPageTab as Tab } from "layout";
import { createElement as h } from "react";
import { Button } from "pi-ui";
import { useProposalsTab } from "./hooks";
import styles from "./ProposalsTab.module.css";

const PageHeader = ({ isTestnet }) => (
  <div className="proposals-community-header is-row">
    <div className="proposals-community-header-wrapper">
      <div className="proposals-community-header-title">
        <T id="proposals.community.title" m="Proposals" />
      </div>
      <div className="proposals-community-header-description">
        <T
          id="proposals.community.descr"
          m="Voting on community proposals allows you to have a say on how the project treasury is spent.
          Participation in voting requires (PoS) tickets. Proposal creation, discussions and other features are available at {link}"
          values={{
            link: (
              <PiLink className="proposals-link">proposals.decred.org</PiLink>
            )
          }}
        />
      </div>
    </div>
    <div className="links">
      <PiLink
        className={styles.politeiaButton}
        CustomComponent={Button}
        path="/proposals/new"
        isTestnet={isTestnet}>
        <T id="proposals.community.createLink" m="Create a Proposal" />
      </PiLink>
    </div>
  </div>
);

const ListLink = ({ count, children }) => (
  <>
    {children}
    {count ? <span className="proposal-list-link-count">{count}</span> : null}
  </>
);

const ProposalsTab = () => {
  const {
    activeVoteCount,
    preVoteCount,
    politeiaEnabled,
    isTestnet,
    tab,
    getTokenAndInitialBatch
  } = useProposalsTab();
  if (!politeiaEnabled) {
    return <PoliteiaDisabled {...{ getTokenAndInitialBatch }} />;
  }
  return (
    <TabbedPage caret={<div />} header={<PageHeader isTestnet={isTestnet} />}>
      <Tab
        path="/governance/proposals/prevote"
        component={h(ProposalList, { tab })}
        key="preVote"
        link={
          <ListLink count={preVoteCount}>
            <T id="proposals.statusLinks.preVote" m="In Discussion" />
          </ListLink>
        }
      />
      <Tab
        path="/governance/proposals/activevote"
        component={h(ProposalList, { tab })}
        key="activevote"
        link={
          <ListLink count={activeVoteCount}>
            <T id="proposals.statusLinks.underVote" m="Voting" />
          </ListLink>
        }
      />
      <Tab
        path="/governance/proposals/voted"
        component={h(ProposalList, { finishedVote: true, tab })}
        key="activevote"
        link={<T id="proposals.statusLinks.voted" m="Finished Voting" />}
      />
      <Tab
        path="/governance/proposals/abandoned"
        component={h(ProposalList, { tab })}
        key="abandoned"
        link={<T id="proposals.statusLinks.abandoned" m="Abandoned" />}
      />
    </TabbedPage>
  );
};

export default ProposalsTab;
