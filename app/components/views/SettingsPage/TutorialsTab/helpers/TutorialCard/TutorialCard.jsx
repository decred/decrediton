import styles from "./TutorialCard.module.css";
import { classNames } from "pi-ui";

const TutorialCard = ({
  name,
  tutorials,
  visitedTabs,
  activeTabIndex,
  showProgressBar,
  className
}) => (
  <div
    className={classNames(
      styles.overview,
      !showProgressBar && styles.small,
      className
    )}>
    <div className={styles.row}>
      <div>
        <div className={styles.title}>{tutorials[name].title}</div>
        {showProgressBar && (
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar}>
              {tutorials[name].slides.map((_, index) => (
                <div
                  key={index + Math.random()}
                  className={classNames(
                    index === activeTabIndex &&
                      index < tutorials[name].slides.length - 1 &&
                      styles.active,
                    visitedTabs.includes(index) && styles.checked
                  )}
                />
              ))}
            </div>
            <div className={styles.stepIndicator}>{`${
              parseInt(activeTabIndex ?? 0) + 1
            }/${tutorials[name].slides.length}`}</div>
          </div>
        )}
        <div className={styles.desc}>{tutorials[name].desc}</div>
      </div>
      <div
        className={classNames(
          styles.thumbnail,
          styles[tutorials[name].thumbnailImage]
        )}
      />
    </div>
  </div>
);

TutorialCard.propTypes = {
  name: PropTypes.string.isRequired,
  tutorials: PropTypes.object.isRequired,
  visitedTabs: PropTypes.array,
  activeTabIndex: PropTypes.number,
  showProgressBar: PropTypes.bool,
  className: PropTypes.string
};

TutorialCard.defaultProps = {
  visitedTabs: [],
  showProgressBar: true
};

export default TutorialCard;
