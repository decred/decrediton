import AgendaOverview from "./AgendaOverview/AgendaOverview";
import { PoliteiaLink as PiLink } from "shared";
import { FormattedMessage as T } from "react-intl";
import PageHeader from "../PageHeader";
import styles from "./VotingPrefs.module.css";
import { Button } from "pi-ui";

const VotingPrefs = ({
  stakePool,
  selectedAgenda,
  getAgendaSelectedChoice,
  onShowAgenda,
  onCloseAgenda,
  onUpdateVotePreference,
  allAgendas,
  settingVoteChoices,
  isLoading
}) => (
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
        allAgendas.map((agenda, index) => (
          <AgendaOverview
            key={agenda.name}
            {...{
              agenda,
              onCloseAgenda,
              onUpdateVotePreference,
              stakePool,
              selectedChoice: getAgendaSelectedChoice(agenda),
              showVoteChoice: index === selectedAgenda,
              settingVoteChoices,
              isLoading
            }}
            disabled={agenda.finished}
            onClick={() => onShowAgenda(index)}
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

export default VotingPrefs;
