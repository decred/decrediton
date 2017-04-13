import React from 'react';
import { StakePoolStyles } from './views/ViewStyles';
import AgendaClose from './AgendaClose';
import KeyBlueButton from './KeyBlueButton';

class AgendaOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: this.props.currentChoice,
    };
  }
  render() {
    return (
          <div style={StakePoolStyles.agenda}>
            <div style={StakePoolStyles.agendaOverview}>
              <div style={StakePoolStyles.agendaOverviewTitleArea}>
                <AgendaClose onClick={() => this.props.closeCurrentAgenda()}/>
                <div style={StakePoolStyles.agendaOverviewTitleName}>{this.props.agenda.agendaName}</div>
              </div>
              <div style={StakePoolStyles.agendaOverviewMiddle}>
                <div style={StakePoolStyles.agendaOverviewText}>
                  <span>{this.props.agenda.agendaDescription}</span><br/>
                  <span style={StakePoolStyles.agendaOverviewAgendaId}>
                    Agenda ID: <span style={StakePoolStyles.agendaOverviewAgendaIdId}>#{this.props.agenda.agendaId}</span>
                  </span>
                  <br/>
                  <br/>
                  <span>
                    Once the majority of the PoW miners have upgraded (75% of the 100 most recent blocks are at the latest version) and the majority of the PoS
                    miners have upgraded (75% of the votes in a 2016 block interval) have upgraded, the voting process begins.
                  </span><br/>
                  <a target="_blank" href="http://decred.org" style={StakePoolStyles.agendaOverViewReadMore}>Read more »</a>
                </div>
              </div>
            </div>
            <div style={StakePoolStyles.agendaOverviewOptionsArea}>
              <div style={StakePoolStyles.agendaOverviewOptionsSection}>
                <div style={StakePoolStyles.agendaNameOptions}>Voting for</div>
              </div>
              <div style={StakePoolStyles.agendaOverviewOptionsSectionMiddle}>
                {this.props.agenda.options.map((option) => {
                  return(
                  <div key={this.props.agenda+option}>
                    <input style={StakePoolStyles.agendaOptionsRadio} id={option} type="radio" name="field" value={option} checked={this.state.choice == {option}} onChange={(e) => {this.setState({choice: e.target.value});this.props.selectAgendaChoice(this.props.agenda.agendaId, e.target.value);}}/>
                    <label style={StakePoolStyles.agendaOptionsRadioLabel} htmlFor={option}><span><span></span></span>{option}</label>
                  </div>
                  );
                })}
              </div>
            </div>
            <div style={StakePoolStyles.agendaBottom}>
              <div style={StakePoolStyles.agendaBottomOverview}>
                <div style={StakePoolStyles.agendaIndicatorPending}>In Progress</div>
                <div style={StakePoolStyles.agendaPercent}><span style={StakePoolStyles.agendaPercentNumber}>{this.props.agenda.percentVoted}</span>%</div>
              </div>
              <div style={StakePoolStyles.agendaBottomOptions}>
                <KeyBlueButton style={StakePoolStyles.agendaUpdatePreferencesButton} onClick={() => this.props.updateAgendaPreference('agenda1')}>Update Preference</KeyBlueButton>
              </div>
            </div>
          </div>

    );
  }
}

export default AgendaOverview;