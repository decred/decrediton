import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";

export const AgendaFinishedIndicator = ({ passed }) => (
  <Tooltip
    text={
      <T
        id="agenda.card.finishedTooltip"
        m="This agenda has finished voting and {passed}.  You may still toggle your vote choices, but they will no longer be tallied."
        values={{ passed: passed ? "PASSED" : "NOT PASSED" }}
      />
    }>
    <div className="agenda-card-indicator-finished">
      <T id="agenda.card.finishedIndicator" m="Finished" />
    </div>
  </Tooltip>
);
