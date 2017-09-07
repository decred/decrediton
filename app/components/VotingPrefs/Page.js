import React from "react";
import AgendaCard from "../AgendaCard";
import AgendaOverview from "../AgendaOverview";
import SelectStakePool from "../SelectStakePool";
import { StakePoolStyles } from "../views/ViewStyles";

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
  <div style={StakePoolStyles.contentVotingGui}>
    <div style={StakePoolStyles.votingTitleArea}>
      <div style={StakePoolStyles.votingTitleAreaName}>Voting Preferences</div>
      <div style={StakePoolStyles.stakePoolUnconfiguredSelect}>
        <SelectStakePool
          options={configuredStakePools}
          value={stakePool}
          onChange={onChangeStakePool}
        />
      </div>
    </div>
    {(stakePool && stakePool.isVersionValid) ? (
      <div style={StakePoolStyles.votingAgendaArea}>
        {(selectedAgenda && stakePool) ? (
          <AgendaOverview
            agenda={selectedAgenda}
            selectedChoice={getAgendaSelectedChoice(selectedAgenda)}
            closeCurrentAgenda={onCloseAgenda}
            updatePreferences={onUpdateVotePreference}
          />
        ) : null}
        {(agendas.length > 0) ? (
          agendas.map(agenda =>
            (!selectedAgenda || (selectedAgenda && agenda.getId() === selectedAgenda.getId())) ? (
              <AgendaCard
                key={agenda.getId()}
                agenda={agenda}
                selectedChoice={getAgendaSelectedChoice(agenda)}
                onClick={() => onShowAgenda(agenda)}
              />
            ) : null
          )
        ) : (
          <div style={StakePoolStyles.noAgendasMessage}>There are currently no agendas for voting.</div>
        )}
      </div>
    ) : (
      <div style={StakePoolStyles.votingAgendaArea}>
        <div style={StakePoolStyles.noAgendasMessage}>This pool is not configured for vote choices.</div>
      </div>
    )}
  </div>
);

export default VotingPrefsPage;
