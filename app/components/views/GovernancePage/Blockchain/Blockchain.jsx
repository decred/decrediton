import { find, compose, eq, get } from "fp";
import { useBlockchain } from "./hooks";
import AgendaOverview from "./AgendaOverview";
import { PoliteiaLink as PiLink } from "shared";
import { FormattedMessage as T } from "react-intl";
import PageHeader from "../PageHeader";
import styles from "./Blockchain.module.css";
import { Button } from "pi-ui";

const Blockchain = () => {
  const { allAgendas, viewAgendaDetailsHandler, voteChoices } = useBlockchain();
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
              m="Consensus changes refer to the on-chain governance aspect of Decred. This means deciding whether to adopt changes to the consensus rules of the network. Participation in voting requires (PoS) tickets. You can know more about Consensus Rule Voting at {link}"
              values={{
                link: (
                  <PiLink
                    className={styles.proposalsLink}
                    hrefProp="https://docs.decred.org/getting-started/user-guides/agenda-voting/">
                    docs.decred.org
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
                href="https://voting.decred.org">
                <T id="votingPreferences.dashboard" m="Voting Dashboard" />
              </PiLink>
            </div>
          }
        />
      </div>
      <div className={styles.agendaWrapper}>
        {allAgendas.length > 0 ? (
          allAgendas.map((agenda) => (
            <AgendaOverview
              key={agenda.name}
              {...{
                agenda,
                selectedChoice: getAgendaSelectedChoice(agenda),
                viewAgendaDetailsHandler
              }}
            />
          ))
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
