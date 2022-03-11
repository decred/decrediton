import { FormattedMessage as T } from "react-intl";
import { createElement as h } from "react";
import { Button, ButtonIcon, Tooltip, useTheme, getThemeProperty } from "pi-ui";
import ProposalsList from "./ProposalsList";
import PoliteiaDisabled from "./PoliteiaDisabled";
import { PoliteiaLink as PiLink } from "shared";
import { TabbedPage } from "layout";
import { useProposalsTab } from "./hooks";
import styles from "./ProposalsTab.module.css";
import PageHeader from "../PageHeader";

const ListLink = ({ count, children }) => (
  <>
    {children}
    {count ? <span className={styles.linkCount}>{count}</span> : null}
  </>
);

const ProposalsTab = ({ isDarkTheme }) => {
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

  const tabs = [
    {
      path: "/governance/proposals/prevote",
      content: h(ProposalsList, { tab, isDarkTheme }),
      key: "preVote",
      className: styles.tab,
      label: (
        <ListLink count={preVoteCount}>
          <T id="proposals.statusLinks.preVote" m="In Discussion" />
        </ListLink>
      )
    },
    {
      path: "/governance/proposals/activevote",
      content: h(ProposalsList, { tab, isDarkTheme }),
      key: "activevote",
      className: styles.tab,
      label: (
        <ListLink count={activeVoteCount}>
          <T id="proposals.statusLinks.underVote" m="Voting" />
        </ListLink>
      )
    },
    {
      path: "/governance/proposals/voted",
      content: h(ProposalsList, { finishedVote: true, tab, isDarkTheme }),
      key: "voted",
      className: styles.tab,
      label: <T id="proposals.statusLinks.voted" m="Finished Voting" />
    },
    {
      path: "/governance/proposals/abandoned",
      content: h(ProposalsList, { tab, isDarkTheme }),
      key: "abandoned",
      className: styles.tab,
      label: <T id="proposals.statusLinks.abandoned" m="Abandoned" />
    }
  ];

  const { theme } = useTheme();
  const iconColor = getThemeProperty(theme, "grey-7");

  const header = (
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
              <ButtonIcon
                type="refresh"
                iconColor={iconColor}
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
                    Participation in voting requires (PoS) tickets. Proposal creation, discussions and other features are available at {label}"
          values={{
            label: (
              <PiLink className={styles.proposalsLink} isTestnet={isTestnet}>
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
            path="/record/new"
            isTestnet={isTestnet}>
            <T id="proposals.community.createLink" m="Create a Proposal" />
          </PiLink>
        </div>
      }
    />
  );

  return (
    <TabbedPage
      header={header}
      tabs={tabs}
      headerClassName={styles.tabsHeader}
      tabsClassName={styles.tabs}
      tabContentClassName={styles.tabContent}
      themes={{
        "tab-default-background": getThemeProperty(
          theme,
          "tab-default-background-tabbedpage-proposals"
        ),
        "tab-active-background": getThemeProperty(
          theme,
          "tab-active-background-tabbedpage-proposals"
        ),
        "tab-default-color": getThemeProperty(
          theme,
          "tab-default-border-tabbedpage-proposals"
        ),
        "tab-active-color": getThemeProperty(
          theme,
          "tab-active-border-tabbedpage-proposals"
        )
      }}
    />
  );
};

export default ProposalsTab;
