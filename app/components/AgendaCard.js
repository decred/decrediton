// @flow
import React from "react";
import "../style/AgendaCard.less";

// Currently removing percent progress until a solution to populate is found
// <div style={styles.agendaCardPercent}><span style={styles.agendaPercentNumber}>XX</span>%</div>
// should go UNDER agendaCarBottomCfg div
export default class AgendaCard extends React.Component {

  render() {
    let agendaCardProps;
    if(!this.props.agenda.finished) {
      agendaCardProps = { className: "agenda-card", onClick: this.props.onClick };
    } else {
      agendaCardProps = { className: "agenda-card-disabled" };
    }

    return (
      <div {...agendaCardProps}>
        <div className="agenda-card-bottom">
          {this.renderIndicator()}
          <div className="agenda-card-bottom-cfg">
            {this.props.agenda.getDescription()} <span className="agenda-card-bottom-cfg-last">Agenda ID: <span className="agenda-card-bottom-cfg-last-bold">{this.props.agenda.getId()}</span></span>
          </div>
        </div>
        <div className="agenda-card-top">
          <div className="agenda-card-name">{this.props.agenda.getId()}</div>
          <div className="agenda-card-top-preference">
            Preference: <span className="agenda-card-text-highlight-small">{this.props.selectedChoice}</span>
          </div>
        </div>
      </div>
    );
  }

  renderIndicator() {
    if(this.props.agenda.finished) {
      return <div className="agenda-card-indicator-finished">Finished</div>;
    }
    else {
      return <div className="agenda-card-indicator-pending">In Progress</div>;
    }
  }

}