import { KeyBlueButton } from "buttons";
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/AgendaOverview.less";

const Overview = ({
  agendaId,
  agendaDescription,
  choices,
  selectedChoiceId,
  hasModifiedChoice,
  closeCurrentAgenda,
  setSelecedChoiceId,
  updatePreferences,
  disabled
}) => (
  <div className="agenda">
    <div className="agenda-overview">
      <div className="agenda-overview-title-area">
        <a className="agenda-overview-title-close" onClick={closeCurrentAgenda}></a>
        <div className="agenda-overview-title-name">{agendaId}</div>
      </div>
      <div className="agenda-overview-middle">
        <div className="agenda-overview-text">
          <div className="agenda-overview-short-description">{agendaDescription}</div>
          <div className="agenda-overview-agenda-id-ct">
            <T id="agenda.card.idLabel" m="Agenda ID" />
            : <span className="agenda-overview-agenda-id">{agendaId}</span>
          </div>
          <div className="agenda-overview-description">
            <T id="agenda.overviewDescription" m="Once the majority of the PoW miners have upgraded (75% of the 100 most recent blocks are at the latest version) and the majority of the PoS miners have upgraded (75% of the votes in a 2016 block interval), the voting process begins." />
          </div>
        </div>
      </div>
    </div>
    <div className="agenda-overview-options-area">
      <div className="agenda-overview-options-section">
        <div className="agenda-name-options">
          <T id="agenda.votingFor" m="Voting for" />
        </div>
      </div>
      <div className="agenda-overview-options-section-middle">
        {choices.map(({ choiceId }) => (
          <div key={agendaId+choiceId}>
            <input
              disabled={disabled}
              className="agenda-options-radio"
              id={choiceId}
              type="radio"
              name="field"
              value={choiceId}
              checked={selectedChoiceId === choiceId}
              onChange={(e) => setSelecedChoiceId(e.target.value)}
            />
            <label
              className="agenda-options-radio-label"
              htmlFor={choiceId}><span><span></span></span>{choiceId}</label>
          </div>
        ))}
      </div>
    </div>
    <div className="agenda-bottom">
      <div className="agenda-bottom-overview">
        <Tooltip text={<T id="agenda.card.finishedTooltip" m="This agenda has finished voting and PASSED.  You may still toggle your vote choices, but they will no longer be tallied." />}>
          <div className="agenda-indicator-finished">
            <T id="agenda.card.finishedIndicator" m="Finished" />
          </div>
        </Tooltip>
      </div>
      <div className="agenda-bottom-options">
        <KeyBlueButton
          disabled={!hasModifiedChoice || disabled}
          className="agenda-update-preferences-button"
          onClick={updatePreferences}
        ><T id="agenda.updatePreference" m="Update Preference" /></KeyBlueButton>
      </div>
    </div>
  </div>
);

// Need to replace once we have a way to get the agenda progress
//  <div className="agenda-percent"><span className="agenda-percent-number">XX</span>%</div>
// needs to go below div.agenda-indicator-pending
export default Overview;

//<a target="_blank" href="http://decred.org" className="agenda-overview-read-more">Read more »</a>
