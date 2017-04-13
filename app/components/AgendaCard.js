import React from 'react';
import Radium from 'radium';
import CardKebab from './icons/tickets-agenda-card-kebab.svg';
import CardKebabHover from './icons/tickets-agenda-card-kebab-hover.svg';
import CardDisabledKebab from './icons/tickets-agenda-card-kebab-disabled.svg';
import IndicatorPending from './icons/indicator-pending.svg';
import IndicatorFinished from './icons/indicator-finished.svg';

const styles = {
  agendaCard: {
    position: 'relative',
    overflow: 'hidden',
    width: '180px',
    height: '190px',
    marginBottom: '20px',
    marginRight: '20px',
    padding: '20px',
    float: 'left',
    backgroundColor: '#fff',
    backgroundImage: `url(${CardKebab})`,
    backgroundPosition: '93% 27px',
    backgroundSize: '10px',
    backgroundRepeat: 'no-repeat',
    boxShadow: '0 3px 6px 0 rgba(9, 24, 45, .1)',
    color: '#0c1e3e',
    cursor: 'pointer',
    ':hover': {
      backgroundImage: `url(${CardKebabHover})`,
      backgroundSize: '10px',
      boxShadow: '0 2px 2px 0 rgba(9, 24, 45, .1)',
    },
  },

  agendaCardDisabled: {
    position: 'relative',
    overflow: 'hidden',
    width: '180px',
    height: '190px',
    marginBottom: '20px',
    marginRight: '20px',
    padding: '20px',
    float: 'left',
    backgroundColor: '#e7eaed',
    backgroundImage: `url(${CardDisabledKebab})`,
    backgroundSize: '10px',
    backgroundPosition: '93% 27px',
    backgroundRepeat: 'no-repeat',
    color: '#8997a5',
    cursor: 'default',
    ':hover': {
      boxShadow: '0 3px 6px 0 rgba(9, 24, 45, .1)',
    },
  },
  agendaCardBottom: {
    position: 'absolute',
    left: '0px',
    right: '0px',
    bottom: '0px',
    padding: '20px',
  },
  agendaCardIndicatorPending: {
    float: 'right',
    display: 'inline-block',
    padding: '5px 8px 5px 20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '3px',
    fontSize: '12px',
    lineHeight: '8px',
    textAlign: 'right',
    textTransform: 'capitalize',
    borderColor: '#2971ff',
    backgroundImage: `url(${IndicatorPending})`,
    backgroundPosition: '6px 50%',
    backgroundSize: '10px',
    backgroundRepeat: 'no-repeat',
    color: '#2971ff',
    position: 'absolute',
    right: '0px',
    bottom: '0px',
    marginRight: '20px',
    marginBottom: '20px',
  },
  agendaCardIndicatorFinished: {
    position: 'absolute',
    right: '0px',
    bottom: '0px',
    marginRight: '20px',
    marginBottom: '20px',
    borderColor: '#8997a5',
    backgroundImage: `url(${IndicatorFinished})`,
    backgroundPosition: '6px 50%',
    backgroundSize: '10px',
    backgroundRepeat: 'no-repeat',
    color: '#8997a5',
    display: 'inline-block',
    padding: '5px 8px 5px 20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '3px',
    fontSize: '12px',
    lineHeight: '8px',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  agendaCardBottomCfg: {
    height: '80px',
    marginBottom: '20px',
    float: 'left',
    color: '#596d81',
  },
  agendaCardBottomCfgLast: {
    color: '#0c1e3e',
  },
  agendaCardBottomCfgDisabled: {
    height: '80px',
    marginBottom: '20px',
    float: 'left',
    color: '#8997a5',
  },
  agendaCardBottomCfgLastDisabled: {
    color: '#8997a5',
  },
  agendaCardBottomCfgLastBold: {
    fontWeight: '600',
  },
  agendaCardPercent: {
    float: 'left',
    fontSize: '19px',
  },
  agendaCardTop: {
    position: 'absolute',
    left: '0px',
    top: '0px',
    right: '0px',
    paddingTop: '20px',
    paddingRight: '20px',
    paddingLeft: '20px',
  },

  agendaCardName: {
    paddingRight: '10px',
    float: 'left',
    fontSize: '19px',
  },
  agendaCardTopPreference: {
    marginTop: '6px',
    float: 'left',
  },
  textHighlightSmall: {
    paddingRight: '2px',
    paddingLeft: '2px',
    borderRadius: '3px',
    backgroundColor: '#d4f0fd',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
};
class AgendaCard extends React.Component {
  render() {
    if (!this.props.agenda.finished) {
      return (
          <div style={styles.agendaCard} onClick={this.props.onClick}>
            <div style={styles.agendaCardBottom}>
              <div style={styles.agendaCardIndicatorPending}>In Progress</div>
              <div style={styles.agendaCardBottomCfg}>
                Change maximum allowed block size from 1MB to 1.25MiB <span style={styles.agendaCardBottomCfgLast}>Agenda ID: <span style={styles.agendaCardBottomCfgLastBold}>#maxblocksize</span></span>
              </div>
              <div style={styles.agendaCardPercent}><span style={styles.agendaPercentNumber}>42</span>%</div>
            </div>
            <div style={styles.agendaCardTop}>
              <div style={styles.agendaCardName}>Agenda name</div>
              <div style={styles.agendaCardTopPreference}>
                Preference: <span style={styles.textHighlightSmall}>Abstain</span>
              </div>
            </div>
          </div>);
    } else {
      return (
          <div style={styles.agendaCardDisabled}>
            <div style={styles.agendaCardBottom}>
              <div style={styles.agendaCardIndicatorFinished}>Finished</div>
              <div style={styles.agendaCardBottomCfg}>Change sdiff calculations <span style={styles.agendaCardBottomCfgLast}>Agenda ID: <span style={styles.agendaCardBottomCfgLastBold}>#maxblocksize</span></span>
              </div>
              <div style={styles.agendaCardPercent}><span style={styles.agendaPercentNumber}>100</span>%</div>
            </div>
            <div style={styles.agendaCardTop}>
              <div style={styles.agendaCardName}>Agenda name</div>
              <div style={styles.agendaCardTopPreference}>Preference: <span style={styles.textHighlightSmall}>Option 1</span>
              </div>
            </div>
          </div>);
    }
  }
}

export default Radium(AgendaCard);