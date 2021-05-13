import { classNames } from "pi-ui";
import styles from "./AgendaDetails.module.css";
import { FormattedMessage as T } from "react-intl";
import { useAgendaDetails } from "./hooks";
import { VoteSection, AgendaCard } from "./helpers";

const AgendaDetails = () => {
  const {
    agenda,
    selectedChoice,
    newSelectedChoice,
    setNewSelectedChoice,
    choices,
    isLoading,
    goBackHistory,
    updatePreferences
  } = useAgendaDetails();
  return (
    <div>
      <div className={classNames(styles.cardWrapper)}>
        <div
          className={classNames(styles.backButton, "flex-centralize")}
          onClick={goBackHistory}>
          <div className={styles.backArrow}></div>
        </div>
        <AgendaCard {...{ agenda, selectedChoice }} />
      </div>
      <VoteSection
        {...{
          choices,
          selected: newSelectedChoice,
          setSelected: setNewSelectedChoice,
          finished: agenda.finished,
          isLoading,
          updatePreferences
        }}
      />
      <div className={styles.detailsText}>
        <T
          id="agenda.overviewDescription"
          m="Once the majority of the PoW miners have upgraded (95% of the 1000 most recent blocks are at the latest version) and the majority of the PoS miners have upgraded (75% of the votes in a 2016 block interval), the voting process begins."
        />
      </div>
    </div>
  );
};

export default AgendaDetails;
