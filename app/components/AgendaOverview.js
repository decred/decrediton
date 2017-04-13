import React from 'react';
import Radium from 'radium';
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
                <AgendaClose onClick={() => this.closeCurrentAgenda()}/>
                <div style={StakePoolStyles.agendaOverviewTitleName}>Agenda name</div>
              </div>
              <div style={StakePoolStyles.agendaOverviewMiddle}>
                <div style={StakePoolStyles.agendaOverviewText}>
                  <span>Change maximum allowed block size from 1MB to 1.25MiB</span><br/>
                  <span style={StakePoolStyles.agendaOverviewAgendaId}>
                    Agenda ID: <span style={StakePoolStyles.agendaOverviewAgendaIdId}>#maxblocksize</span>
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
                  <input style={StakePoolStyles.agendaOptionsRadio} id="option1" type="radio" name="field" value="option1" checked={this.state.choice == 'option1'} onChange={(e) => {this.setState({choice: e.target.value});this.props.selectAgendaChoice('agenda1', e.target.value);}}/>
                  <label style={StakePoolStyles.agendaOptionsRadioLabel} htmlFor="option1"><span><span></span></span>Option 1</label>
                  <input style={StakePoolStyles.agendaOptionsRadio} id="option2" type="radio" name="field" value="option2" checked={this.state.choice == 'option2'} onChange={(e) => {this.setState({choice: e.target.value});this.props.selectAgendaChoice('agenda1', e.target.value);}}/>
                  <label style={StakePoolStyles.agendaOptionsRadioLabel} htmlFor="option2"><span><span></span></span>Option 2</label>
                  <input style={StakePoolStyles.agendaOptionsRadio} id="option3" type="radio" name="field" value="option3" checked={this.state.choice == 'option3'} onChange={(e) => {this.setState({choice: e.target.value});this.props.selectAgendaChoice('agenda1', e.target.value);}}/>
                  <label style={StakePoolStyles.agendaOptionsRadioLabel} htmlFor="option3"><span><span></span></span>Option 3</label>
                  <input style={StakePoolStyles.agendaOptionsRadio} id="option4" type="radio" name="field" value="option4" checked={this.state.choice == 'option4'} onChange={(e) => {this.setState({choice: e.target.value});this.props.selectAgendaChoice('agenda1', e.target.value);}}/>
                  <label style={StakePoolStyles.agendaOptionsRadioLabel} htmlFor="option4"><span><span></span></span>Option 4</label>
                  <input style={StakePoolStyles.agendaOptionsRadio} id="option5" type="radio" name="field" value="option5" checked={this.state.choice == 'option5'} onChange={(e) => {this.setState({choice: e.target.value});this.props.selectAgendaChoice('agenda1', e.target.value);}}/>
                  <label style={StakePoolStyles.agendaOptionsRadioLabel} htmlFor="option5"><span><span></span></span>Option 5</label>
                  <input style={StakePoolStyles.agendaOptionsRadio} id="option6" type="radio" name="field" value="option6" checked={this.state.choice == 'option6'} onChange={(e) => {this.setState({choice: e.target.value});this.props.selectAgendaChoice('agenda1', e.target.value);}}/>
                  <label style={StakePoolStyles.agendaOptionsRadioLabel} htmlFor="option6"><span><span></span></span>Option 6</label>
              </div>
            </div>
            <div style={StakePoolStyles.agendaBottom}>
              <div style={StakePoolStyles.agendaBottomOverview}>
                <div style={StakePoolStyles.agendaIndicatorPending}>In Progress</div>
                <div style={StakePoolStyles.agendaPercent}><span style={StakePoolStyles.agendaPercentNumber}>42</span>%</div>
              </div>
              <div style={StakePoolStyles.agendaBottomOptions}>
                <KeyBlueButton style={StakePoolStyles.agendaUpdatePreferencesButton} onClick={() => this.props.updateAgendaPreference('agenda1')}>Update Preference</KeyBlueButton>
              </div>
            </div>
          </div>

    );
  }
}

export default Radium(AgendaOverview);