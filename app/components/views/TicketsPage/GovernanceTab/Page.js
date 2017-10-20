import React from "react";
import TabContent from "../../../TabbedPage/TabContent";
import AgendaCard from "../../../AgendaCard";
import AgendaOverview from "../../../AgendaOverview";
import SelectStakePool from "../../../SelectStakePool";
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
  <TabContent>
    <div className="stakepool-voting-title-area">
      <div className="stakepool-voting-title-area-name">
        <T id="votingPreferences.title" m="Voting Preferences" />
      </div>
      {configuredStakePools.length > 0 ?
      <div className="stakepool-unconfigured-select">
        <SelectStakePool
          options={configuredStakePools}
          value={stakePool}
          onChange={onChangeStakePool}
        />
      </div> :
      <div></div>
      }
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
          <T id="votingPreferences.noAgenda" m="There are currently no agendas for voting." />
        </div>
      )}
      </div>
  </TabContent>
);

export default VotingPrefsPage;
