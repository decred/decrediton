// @flow
import React from "react";
import { StakePoolStyles } from "./views/ViewStyles";
import AgendaClose from "./AgendaClose";
import KeyBlueButton from "./KeyBlueButton";

class AgendaOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: this.props.selectedChoice,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedChoice != nextProps.selectedChoice) {
      this.setState({choice: nextProps.selectedChoice});
    }
  }
  render() {
    return (
          <div style={StakePoolStyles.agenda}>
            <div style={StakePoolStyles.agendaOverview}>
              <div style={StakePoolStyles.agendaOverviewTitleArea}>
                <AgendaClose onClick={() => this.props.closeCurrentAgenda()}/>
                <div style={StakePoolStyles.agendaOverviewTitleName}>{this.props.agenda.getId()}</div>
              </div>
              <div style={StakePoolStyles.agendaOverviewMiddle}>
                <div style={StakePoolStyles.agendaOverviewText}>
                  <span>{this.props.agenda.getDescription()}</span><br/>
                  <span style={StakePoolStyles.agendaOverviewAgendaId}>
                    Agenda ID: <span style={StakePoolStyles.agendaOverviewAgendaIdId}>{this.props.agenda.getId()}</span>
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
                {this.props.agenda.getChoicesList().map((choice) => {
                  return(
                  <div key={this.props.agenda.getId()+choice.getId()}>
                    <input style={StakePoolStyles.agendaOptionsRadio} id={choice.getId()} type="radio" name="field" value={choice.getId()} checked={this.state.choice == choice.getId()} onChange={(e) => {this.setState({choice: e.target.value});}}/>
                    <label style={StakePoolStyles.agendaOptionsRadioLabel} htmlFor={choice.getId()}><span><span></span></span>{choice.getId()}</label>
                  </div>
                  );
                })}
              </div>
            </div>
            <div style={StakePoolStyles.agendaBottom}>
              <div style={StakePoolStyles.agendaBottomOverview}>
                <div style={StakePoolStyles.agendaIndicatorPending}>In Progress</div>
              </div>
              <div style={StakePoolStyles.agendaBottomOptions}>
                <KeyBlueButton disabled={this.props.selectedChoice == this.state.choice} style={StakePoolStyles.agendaUpdatePreferencesButton} onClick={this.props.selectedChoice !== this.state.choice ? () => this.props.updatePreferences(this.props.agenda.getId(), this.state.choice):null}>Update Preference</KeyBlueButton>
              </div>
            </div>
          </div>

    );
  }
}
// Need to replace once we have a way to get the agenda progress
//  <div style={StakePoolStyles.agendaPercent}><span style={StakePoolStyles.agendaPercentNumber}>XX</span>%</div>
// needs to go below agendaIndicatorPending div
export default AgendaOverview;

//<a target="_blank" href="http://decred.org" style={StakePoolStyles.agendaOverViewReadMore}>Read more »</a>