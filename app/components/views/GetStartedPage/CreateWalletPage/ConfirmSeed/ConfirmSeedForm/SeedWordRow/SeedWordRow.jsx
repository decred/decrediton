import { FormattedMessage as T } from "react-intl";
import styles from "./SeedWordRow.module.css";
import { classNames } from "pi-ui";

const SeedWordRow = ({
  word,
  wordsToShow,
  selected,
  index,
  onSeedButtonClick
}) => (
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
      {wordsToShow.map((wordToShow, wordToShowIndex) => {
        const isWordSelected = selected === wordToShowIndex;
        const isSelectedWordInvalid = isWordSelected && word !== wordToShow;
        return (
          <button
            disabled={selected === wordToShowIndex}
            className={classNames(isSelectedWordInvalid && styles.invalid)}
            key={`${index}-${wordToShowIndex}`}
            onClick={() => onSeedButtonClick(index, wordToShowIndex)}>
            {wordToShow}
          </button>
        );
      })}
    </div>
  </div>
);

SeedWordRow.propTypes = {
  word: PropTypes.string.isRequired,
  wordsToShow: PropTypes.array.isRequired,
  selected: PropTypes.number,
  index: PropTypes.number.isRequired,
  onSeedButtonClick: PropTypes.func.isRequired
};

export default SeedWordRow;
