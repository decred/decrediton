import { FormattedMessage as T } from "react-intl";
import { createElement as h } from "react";
import { Button, Tooltip } from "pi-ui";
import ProposalsList from "./ProposalsList";
import PoliteiaDisabled from "./PoliteiaDisabled";
import { PoliteiaLink as PiLink } from "shared";
import { TabbedPage, TabbedPageTab as Tab } from "layout";
import { useProposalsTab } from "./hooks";
import styles from "./ProposalsTab.module.css";
import PageHeader from "../PageHeader";
import { SmallButton } from "buttons";

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
      header={
        <PageHeader
          title={
            <>
              <div>
                <T id="proposals.community.title" m="Proposals" />
              </div>
              <div>
                <Tooltip
                  className={styles.refreshProposalsTooltip}
                  contentClassName={styles.refreshProposalsTooltipContent}
                  content={
                    <T
                      id="proposals.community.refreshProposals"
                      m="Refresh Proposals"
                    />
                  }
                  placement="right">
                  <SmallButton
                    className={styles.refreshProposals}
                    onClick={compareInventory}
                  />
                </Tooltip>
              </div>
            </>
          }
          description={
            <T
              id="proposals.community.descr"
              m="Voting on community proposals allows you to have a say on how the project treasury is spent.
                    Participation in voting requires (PoS) tickets. Proposal creation, discussions and other features are available at {link}"
              values={{
                link: (
                  <PiLink
                    className={styles.proposalsLink}
                    isTestnet={isTestnet}>
                    proposals.decred.org
                  </PiLink>
                )
              }}
            />
          }
          optionalButton={
            <div>
              <PiLink
                className={styles.politeiaButton}
                CustomComponent={Button}
                path="/proposals/new"
                isTestnet={isTestnet}>
                <T id="proposals.community.createLink" m="Create a Proposal" />
              </PiLink>
            </div>
          }
        />
      }
      headerClassName={styles.tabsHeader}
      tabsClassName={styles.tabs}
      tabContentClassName={styles.tabContent}
      activeCaretClassName={styles.activeCaret}>
      <Tab
        path="/governance/proposals/prevote"
        component={h(ProposalsList, { tab })}
        key="preVote"
        className={styles.tab}
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
        className={styles.tab}
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
        className={styles.tab}
        link={<T id="proposals.statusLinks.voted" m="Finished Voting" />}
      />
      <Tab
        path="/governance/proposals/abandoned"
        component={h(ProposalsList, { tab })}
        key="abandoned"
        className={styles.tab}
        link={<T id="proposals.statusLinks.abandoned" m="Abandoned" />}
      />
    </TabbedPage>
  );
};

export default ProposalsTab;
