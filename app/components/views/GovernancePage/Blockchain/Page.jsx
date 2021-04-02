import AgendaOverview from "./AgendaOverview/AgendaOverview";
import { ExternalLink } from "shared";
import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import styles from "./VotingPrefs.module.css";

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
    <div className={classNames(styles.header, "flex-row")}>
      <div>
        <div className={styles.title}>
          <T id="votingPreferences.title" m="Consensus Changes" />
        </div>
        <p className={styles.description}>
          <T
            id="votingPreferences.description"
            m="Consensus changes refer to the on-chain governance aspect of Decred. This means deciding whether to adopt changes to the consensus rules of the network. Participation in voting requires (PoS) tickets."
          />
        </p>
      </div>
      <div className={styles.links}>
        <ExternalLink
          className={styles.infoButton}
          href="https://docs.decred.org/getting-started/user-guides/agenda-voting/"
        />
        <ExternalLink
          className={styles.dashboardButton}
          href="https://voting.decred.org">
          <T id="votingPreferences.dashboard" m="Voting Dashboard" />
        </ExternalLink>
      </div>
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
