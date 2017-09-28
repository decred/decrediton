import React from "react";
import "../style/AgendaCard.less";
import { FormattedMessage } from "react-intl";

// Currently removing percent progress until a solution to populate is found
// <div style={styles.agendaCardPercent}><span style={styles.agendaPercentNumber}>XX</span>%</div>
// should go UNDER agendaCarBottomCfg div
const AgendaCard = ({
  agenda, onClick, selectedChoice
}) => (
  <div {...(
    agenda.finished
      ? ({ className: "agenda-card-disabled" })
      : ({ className: "agenda-card", onClick })
  )}>
    <div className="agenda-card-bottom">
      {agenda.finished ? (
        <div className="agenda-card-indicator-finished">
          <FormattedMessage id="agenda.finished" defaultMessage="Finished" />
        </div>
      ) : (
        <div className="agenda-card-indicator-pending">
          <FormattedMessage id="agenda.inProgress" defaultMessage="In Progress" />
        </div>
      )}
      <div className="agenda-card-bottom-cfg">
        {agenda.getDescription()} <span className="agenda-card-bottom-cfg-last">
          <FormattedMessage id="agenda.id" defaultMessage="Agenda ID" />:
          <span className="agenda-card-bottom-cfg-last-bold">{agenda.getId()}</span></span>
      </div>
    </div>
    <div className="agenda-card-top">
      <div className="agenda-card-name">{agenda.getId()}</div>
      <div className="agenda-card-top-preference">
        Preference: <span className="agenda-card-text-highlight-small">{selectedChoice}</span>
      </div>
    </div>
  </div>
);

export default AgendaCard;
