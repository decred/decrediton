import React from "react";
import AgendaCard from "../AgendaCard";
import AgendaOverview from "../AgendaOverview";
import SelectStakePool from "../SelectStakePool";
import { FormattedMessage } from "react-intl";
import "../../style/StakePool.less";

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
  <div className="stakepool-content-voting-gui page-content">
    <div className="stakepool-voting-title-area">
      <div className="stakepool-voting-title-area-name">
        <FormattedMessage id="votingPreferences.title" defaultMessage="Voting Preferences" />
      </div>
      <div className="stakepool-unconfigured-select">
        <SelectStakePool
          options={configuredStakePools}
          value={stakePool}
          onChange={onChangeStakePool}
        />
      </div>
    </div>
    {(stakePool && stakePool.isVersionValid) ? (
      <div className="stakepool-voting-agenda-area">
        {selectedAgenda ? (
          <AgendaOverview
            agenda={selectedAgenda}
            selectedChoice={getAgendaSelectedChoice(selectedAgenda)}
            closeCurrentAgenda={onCloseAgenda}
            updatePreferences={onUpdateVotePreference}
          />
        ) : null}
        {(agendas.length > 0) ? (
          agendas.map(agenda =>
            (!selectedAgenda || selectedAgenda.getId() !== agenda.getId()) ? (
              <AgendaCard
                key={agenda.getId()}
                agenda={agenda}
                selectedChoice={getAgendaSelectedChoice(agenda)}
                onClick={() => onShowAgenda(agenda)}
              />
            ) : null
          )
        ) : (
          <div className="stakepool-no-agendas-message">
            <FormattedMessage id="votingPreferences.noAgenda" defaultMessage="There are currently no agendas for voting." />
          </div>
        )}
      </div>
    ) : (
      <div className="stakepool-voting-agenda-area">
        <div className="stakepool-no-agendas-message">
          <FormattedMessage id="votingPreferences.noVoteChoices" defaultMessage="This pool is not configured for vote choices." /></div>
      </div>
    )}
  </div>
);

export default VotingPrefsPage;
