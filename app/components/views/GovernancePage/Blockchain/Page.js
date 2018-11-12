import AgendaCard from "./AgendaCard";
import AgendaOverview from "./AgendaOverview";
import { ExternalLink } from "shared";
import { FormattedMessage as T } from "react-intl";

const VotingPrefsPage = ({
  agendas,
  stakePool,
  selectedAgenda,
  getAgendaSelectedChoice,
  onShowAgenda,
  onCloseAgenda,
  onUpdateVotePreference,
}) => (
  <Aux>
    <div className="consensus-changes-header">
      <div className="proposals-community-header-title"><T id="votingPreferences.title" m="Consensus Changes" /></div>
      <p className="proposals-community-header-description">
        <T id="votingPreferences.description" m="Consensus changes refer to the on-chain governance aspect of Decred. This means deciding whether to adopt changes to the consensus rules of the network. Participation in voting requires (PoS) tickets." />
      </p>
      <div className="links">
        <ExternalLink className="info-modal-button" href="https://docs.decred.org/getting-started/user-guides/agenda-voting/"/>
        <ExternalLink href="https://voting.decred.org"><T id="votingPreferences.dashboard" m="Voting Dashboard" /></ExternalLink>
      </div>
    </div>
    <div className="stakepool-voting-agenda-area">
      {selectedAgenda ? (
        <AgendaOverview
          agenda={selectedAgenda}
          selectedChoice={getAgendaSelectedChoice(selectedAgenda)}
          closeCurrentAgenda={onCloseAgenda}
          updatePreferences={onUpdateVotePreference}
          disabled={!stakePool || !stakePool.isVersionValid}
        />
      ) : null}
      {(agendas.length > 0) ?
        agendas.map(agenda =>
          (!selectedAgenda || selectedAgenda.getId() !== agenda.getId()) &&
            <AgendaCard
              key={agenda.getId()}
              agenda={agenda}
              selectedChoice={getAgendaSelectedChoice(agenda)}
              onClick={() => onShowAgenda(agenda)}
            />
        )
        : (
          <div className="stakepool-no-agendas-message">
            <T id="votingPreferences.noAgenda" m="There are currently no agendas for voting." />
          </div>
        )}
    </div>
  </Aux>
);

export default VotingPrefsPage;
