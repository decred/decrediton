import { classNames } from "pi-ui";
import styles from "./SeedWord.module.css";
import SeedWordEntry from "../SeedWordEntry";

const SeedWord = ({
  seedWord,
  onChangeSeedWord,
  onPasteFromClipboard,
  onPaste
}) => {
  const { index, show, match, word, error } = seedWord;
  return (
    <div
      key={`seeditem-${index}`}
      className={classNames(
        styles.seedWord,
        show && styles.filled,
        !show && word !== "" && match && styles.match,
        !show && word !== "" && !match && styles.noMatch,
        !show && word === "" && styles.empty,
        word && error && styles.error,
        word && !error && styles.populated,
        !word && !error && styles.restore
      )}>
      <span className={styles.number}>{index + 1}.</span>
      <span className={styles.word}>
        {show ? (
          word
        ) : (
          <SeedWordEntry
            disabled={show}
            onChange={onChangeSeedWord}
            seedWord={seedWord}
            // this gonna change when moving to pi-ui's Select
            className="Select-menu-with-arrow"
            value={{ name: word }}
            onPasteFromClipboard={onPasteFromClipboard}
            onPaste={onPaste}
          />
        )}
      </span>
    </div>
  );
};

export default SeedWord;
