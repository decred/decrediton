import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";

export const AgendaFinishedIndicator = () => (
  <Tooltip text={<T id="agenda.card.finishedTooltip" m="This agenda has finished voting and PASSED.  You may still toggle your vote choices, but they will no longer be tallied." />}>
    <div className="agenda-card-indicator-finished">
      <T id="agenda.card.finishedIndicator" m="Finished" />
    </div>
  </Tooltip>
);
