import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import "style/AgendaCard.less";

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
      <Tooltip text={<T id="agenda.card.finishedTooltip" m="This agenda has finished voting and PASSED.  You may still toggle your vote choices, but they will no longer be tallied." />}>
        <div className="agenda-card-indicator-finished">
          <T id="agenda.card.finishedIndicator" m="Finished" />
        </div>
      </Tooltip>
      <div className="agenda-card-bottom-cfg">
        {agenda.getDescription()} <span className="agenda-card-bottom-cfg-last">
          <T id="agenda.overview.idLabel" m="Agenda ID" />:
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
/*
  XXX We are currently going to automatically set the agendas to finished to avoid confusion
  Once we have figured a more graceful way to determine whether an agenda is still active we can just leave this.

{agenda.finished ? (
  <div className="agenda-card-indicator-finished">
    <T id="agenda.card.finishedIndicator" m="Finished" />
  </div>
) : (
  <div className="agenda-card-indicator-pending">
    <T id="agenda.card.inProgressIndicator" m="In Progress" />
  </div>
)}
*/
