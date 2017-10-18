import React from "react";
import AgendaCard from "../AgendaCard";
import AgendaOverview from "../AgendaOverview";
import SelectStakePool from "../SelectStakePool";
import { FormattedMessage as T } from "react-intl";
import { Heading, Flex } from "shared";
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
  <div className="stakepool-content-voting-gui page-content">
    <Flex my="1em">
      <Heading f={ 20 } ><T id="votingPreferences.title" m="Voting Preferences" /></Heading>
      <SelectStakePool w="20em" ml="auto"
        options={configuredStakePools}
        value={stakePool}
        onChange={onChangeStakePool} />
    </Flex>
    {(stakePool && stakePool.isVersionValid) ? (
      <div className="stakepool-voting-agenda-area">
        {selectedAgenda && (
          <AgendaOverview
            agenda={selectedAgenda}
            selectedChoice={getAgendaSelectedChoice(selectedAgenda)}
            closeCurrentAgenda={onCloseAgenda}
            updatePreferences={onUpdateVotePreference} />
        )}
        {(agendas.length > 0) ? (
          agendas.map(agenda =>
            <AgendaCard
              show={ !selectedAgenda || selectedAgenda.getId() !== agenda.getId() }
              key={agenda.getId()}
              agenda={agenda}
              selectedChoice={getAgendaSelectedChoice(agenda)}
              onClick={() => onShowAgenda(agenda)} />
          )
        ) : (
          <div className="stakepool-no-agendas-message">
            <T id="votingPreferences.noAgenda" m="There are currently no agendas for voting." />
          </div>
        )}
      </div>
    ) : (
      <div className="stakepool-voting-agenda-area">
        <div className="stakepool-no-agendas-message">
          <T id="votingPreferences.noVoteChoices" m="This pool is not configured for vote choices." /></div>
      </div>
    )}
  </div>
);

export default VotingPrefsPage;
