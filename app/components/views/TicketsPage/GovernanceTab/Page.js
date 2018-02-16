import AgendaCard from "./AgendaCard";
import AgendaOverview from "./AgendaOverview";
import { StakePoolSelect } from "inputs";
import { FormattedMessage as T } from "react-intl";
import "style/StakePool.less";

const VotingPrefsPage = ({
  agendas,
  stakePool,
  selectedAgenda,
  configuredStakePools,
  onChangeStakePool,
  getAgendaSelectedChoice,
  onShowAgenda,
  onCloseAgenda,
  onUpdateVotePreference
}) => (
  <Aux>
    <div className="stakepool-voting-title-area">
      <div className="stakepool-voting-title-area-name">
        <T id="votingPreferences.title" m="Voting Preferences" />
      </div>
      {configuredStakePools.length > 0 &&
      <div className="stakepool-unconfigured-select">
        <StakePoolSelect
          options={configuredStakePools}
          value={stakePool}
          onChange={onChangeStakePool}
        />
      </div>}
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
