import { FormattedMessage as T } from "react-intl";
import styles from "./SeedWordRow.module.css";

const SeedWordRow = ({ wordsToShow, selected, index, onSeedButtonClick }) => (
  <div className={styles.seedWordsForm}>
    <label>
      <T
        id="confirmSeed.word.label"
        m="Word #{index}"
        values={{
          index: index + 1
        }}
      />
    </label>
    <div className={styles.buttonContainer}>
      {wordsToShow.map((wordToShow, wordToShowIndex) => (
        <button
          disabled={selected === wordToShowIndex}
          key={`${index}-${wordToShowIndex}`}
          onClick={() => onSeedButtonClick(index, wordToShowIndex)}>
          {wordToShow}
        </button>
      ))}
    </div>
  </div>
);

SeedWordRow.propTypes = {
  wordsToShow: PropTypes.array.isRequired,
  selected: PropTypes.number,
  index: PropTypes.number.isRequired,
  onSeedButtonClick: PropTypes.func.isRequired
};

export default SeedWordRow;
