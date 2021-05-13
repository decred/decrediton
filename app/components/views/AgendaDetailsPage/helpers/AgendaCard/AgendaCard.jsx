import styles from "./AgendaCard.module.css";
import { classNames, Tooltip, StatusTag } from "pi-ui";
import { FormattedMessage as T } from "react-intl";

const AgendaCard = ({ agenda, selectedChoice, className }) => {
  const inProgress = !agenda.finished;

  return (
    <div className={classNames(styles.overview, className)}>
      <div className={styles.row}>
        <div className="flex-column">
          <div className={styles.titleText}>{agenda.name}</div>
          <div className={styles.agendaId}>
            <T
              id="agenda.overview.idLabel"
              m="Agenda ID: {name}"
              values={{
                name: <strong>{agenda.name}</strong>
              }}
            />
          </div>
          <div className={styles.description}>{`${agenda.description} `}</div>
        </div>
        <div className={classNames("flex-column", "align-end")}>
          {!inProgress ? (
            <Tooltip
              contentClassName={styles.tooltipContent}
              content={
                <T
                  id="agenda.card.finishedTooltip"
                  m="This agenda has finished voting and {passed}."
                  values={{ passed: agenda.passed ? "PASSED" : "NOT PASSED" }}
                />
              }>
              <StatusTag
                className={styles.statusTag}
                type="greenCheck"
                text="Finished"
              />
            </Tooltip>
          ) : (
            <Tooltip
              contentClassName={styles.tooltipContent}
              content={
                <T
                  id="agenda.card.inProgressTooltip"
                  m="Voting is still in progress."
                />
              }>
              <StatusTag
                className={styles.statusTag}
                type="bluePending"
                text="In Progress"
              />
            </Tooltip>
          )}
          <div className={styles.preference}>
            <T
              id="agenda.card.preference"
              m="Preference: {selectedChoice}"
              values={{
                selectedChoice: <span>{selectedChoice}</span>
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaCard;
