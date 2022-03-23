import { find, compose, eq, get } from "fp";
import { useBlockchain } from "./hooks";
import AgendaOverview from "./AgendaOverview";
import { ExternalLink, ExternalButton } from "shared";
import { FormattedMessage as T, defineMessages } from "react-intl";
import PageHeader from "../PageHeader";
import styles from "./Blockchain.module.css";
import { Tooltip } from "pi-ui";
import { TextInput } from "inputs";
import { EyeFilterMenu } from "buttons";
import { useIntl } from "react-intl";
import { useState, useEffect } from "react";

const messages = defineMessages({
  filterByNamePlaceholder: {
    id: "blockchain.filterByNamePlaceholder",
    defaultMessage: "Filter by Name"
  }
});

const sortOptions = [
  {
    key: "desc",
    value: "desc",
    label: <T id="agendas.sortby.newest" m="Newest" />
  },
  {
    key: "asc",
    value: "asc",
    label: <T id="agendas.sortby.oldest" m="Oldest" />
  }
];

const Blockchain = () => {
  const { allAgendas, voteChoices, viewAgendaDetailsHandler } = useBlockchain();
  const [filterByName, setFilterByName] = useState("");
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [agendas, setAgendas] = useState(allAgendas);
  const intl = useIntl();
  const sortByKey = sortBy.key;

  useEffect(() => {
    let newAgendas =
      sortByKey === "desc" ? [...allAgendas] : [...allAgendas].reverse();

    if (filterByName.trim() !== "") {
      newAgendas = newAgendas.filter(
        (agenda) => agenda.name.search(filterByName.trim()) !== -1
      );
    }

    setAgendas(newAgendas);
  }, [allAgendas, filterByName, sortByKey]);

  const getAgendaSelectedChoice = (agenda) =>
    get(
      ["choiceId"],
      find(compose(eq(agenda.name), get(["agendaId"])), voteChoices)
    ) || "abstain";

  return (
    <>
      <div className={styles.headerWrapper}>
        <PageHeader
          title={<T id="votingPreferences.title" m="Consensus Changes" />}
          description={
            <T
              id="votingPreferences.description"
              m="Consensus changes refer to the on-chain governance aspect of Decred. This means deciding whether to adopt changes to the consensus rules of the network. Participation in voting requires (PoS) tickets. You can learn more about Consensus Rule Voting at {link}"
              values={{
                link: (
                  <ExternalLink
                    className={styles.proposalsLink}
                    href="https://docs.decred.org/getting-started/user-guides/agenda-voting/">
                    docs.decred.org
                  </ExternalLink>
                )
              }}
            />
          }
          optionalButton={
            <div>
              <ExternalButton
                className={styles.politeiaButton}
                href="https://voting.decred.org"
                hrefTestNet="https://voting.decred.org/testnet">
                <T
                  id="votingPreferences.dashboard"
                  m="Go to Voting Dashboard"
                />
              </ExternalButton>
            </div>
          }
        />
      </div>
      <div className={styles.filters}>
        <div className={styles.searchByNameInput}>
          <TextInput
            id="searchByNameInput"
            type="text"
            placeholder={intl.formatMessage(messages.filterByNamePlaceholder)}
            value={filterByName}
            onChange={(e) => setFilterByName(e.target.value)}
          />
        </div>
        <div>
          <Tooltip
            contentClassName={styles.sortByTooltip}
            content={<T id="agendas.sortby.tooltip" m="Sort By" />}>
            <EyeFilterMenu
              labelKey="label"
              keyField="value"
              options={sortOptions}
              selected={sortByKey}
              onChange={(v) => setSortBy(v)}
            />
          </Tooltip>
        </div>
      </div>
      <div className={styles.agendaWrapper}>
        {agendas.length > 0 ? (
          agendas.map((agenda) => (
            <AgendaOverview
              key={agenda.name}
              {...{
                agenda,
                selectedChoice: getAgendaSelectedChoice(agenda),
                viewAgendaDetailsHandler
              }}
            />
          ))
        ) : filterByName ? (
          <div>
            <T
              id="votingPreferences.noFoundAgenda"
              m="No agendas matched your search."
            />
          </div>
        ) : (
          <div>
            <T
              id="votingPreferences.noAgenda"
              m="There are currently no agendas for voting."
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Blockchain;
