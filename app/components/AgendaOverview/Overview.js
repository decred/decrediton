// @flow
import React from "react";
import { StakePoolStyles } from "../views/ViewStyles";
import AgendaClose from "../AgendaClose";
import KeyBlueButton from "../KeyBlueButton";

const Overview = ({
  agendaId,
  agendaDescription,
  choices,
  selectedChoiceId,
  hasModifiedChoice,
  closeCurrentAgenda,
  setSelecedChoiceId,
  updatePreferences
}) => (
  <div style={StakePoolStyles.agenda}>
    <div style={StakePoolStyles.agendaOverview}>
      <div style={StakePoolStyles.agendaOverviewTitleArea}>
        <AgendaClose onClick={closeCurrentAgenda}/>
        <div style={StakePoolStyles.agendaOverviewTitleName}>{agendaId}</div>
      </div>
      <div style={StakePoolStyles.agendaOverviewMiddle}>
        <div style={StakePoolStyles.agendaOverviewText}>
          <span>{agendaDescription}</span><br/>
          <span style={StakePoolStyles.agendaOverviewAgendaId}>
            Agenda ID: <span style={StakePoolStyles.agendaOverviewAgendaIdId}>{agendaId}</span>
          </span>
          <br/>
          <br/>
          <span>
            Once the majority of the PoW miners have upgraded (75% of the 100 most recent blocks are at the latest version) and the majority of the PoS
            miners have upgraded (75% of the votes in a 2016 block interval) have upgraded, the voting process begins.
          </span><br/>
        </div>
      </div>
    </div>
    <div style={StakePoolStyles.agendaOverviewOptionsArea}>
      <div style={StakePoolStyles.agendaOverviewOptionsSection}>
        <div style={StakePoolStyles.agendaNameOptions}>Voting for</div>
      </div>
      <div style={StakePoolStyles.agendaOverviewOptionsSectionMiddle}>
        {choices.map(({ choiceId }) => (
          <div key={agendaId+choiceId}>
            <input
              style={StakePoolStyles.agendaOptionsRadio}
              id={choiceId}
              type="radio"
              name="field"
              value={choiceId}
              checked={selectedChoiceId === choiceId}
              onChange={(e) => setSelecedChoiceId(e.target.value)}
            />
            <label
              style={StakePoolStyles.agendaOptionsRadioLabel}
              htmlFor={choiceId}><span><span></span></span>{choiceId}</label>
          </div>
        ))}
      </div>
    </div>
    <div style={StakePoolStyles.agendaBottom}>
      <div style={StakePoolStyles.agendaBottomOverview}>
        <div style={StakePoolStyles.agendaIndicatorPending}>In Progress</div>
      </div>
      <div style={StakePoolStyles.agendaBottomOptions}>
        <KeyBlueButton
          disabled={!hasModifiedChoice}
          style={StakePoolStyles.agendaUpdatePreferencesButton}
          onClick={updatePreferences}
        >Update Preference</KeyBlueButton>
      </div>
    </div>
  </div>
);

// Need to replace once we have a way to get the agenda progress
//  <div style={StakePoolStyles.agendaPercent}><span style={StakePoolStyles.agendaPercentNumber}>XX</span>%</div>
// needs to go below agendaIndicatorPending div
export default Overview;

//<a target="_blank" href="http://decred.org" style={StakePoolStyles.agendaOverViewReadMore}>Read more »</a>
