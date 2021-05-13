import AgendaCard from "../../../AgendaDetailsPage/helpers/AgendaCard";
import styles from "./AgendaOverview.module.css";
import { classNames } from "pi-ui";

const AgendaOverview = ({
  selectedChoice,
  agenda,
  viewAgendaDetailsHandler
}) => {
  return (
    <div
      onClick={() => viewAgendaDetailsHandler(agenda.name)}
      className={classNames(styles.cardWrapper)}>
      <AgendaCard {...{ agenda, selectedChoice, className: styles.overview }} />
      <div className={classNames(styles.continueButton, "flex-centralize")}>
        <div className={styles.continueArrow}></div>
      </div>
    </div>
  );
};

export default AgendaOverview;
