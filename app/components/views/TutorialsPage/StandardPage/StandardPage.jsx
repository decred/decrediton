import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import { StepIndicator } from "indicators";
import { Documentation } from "shared";
import styles from "./StandardPage.module.css";

export const MakeStandardPage = (image, docName) => (props) =>
  <StandardPage {...props} docName={docName} image={image} />;

const StandardPage = ({
  image,
  docName,
  currentPageIndex,
  pageCount,
  onNextPage,
  onPreviousPage,
  onGoToPage,
  onFinish
}) => {
  return (
    <div className={styles.standardPage}>
      <div className={styles.text}>
        <Documentation name={docName} />
      </div>
      <div className={styles.imageAndIndicator}>
        <div className={classNames(styles.image, styles[image])} />
        <div className={styles.indicator}>
          {pageCount < 2 ? null : (
            <a onClick={onPreviousPage}>
              <T id="tutorial.standardPage.previousPage" m="Previous" />
            </a>
          )}
          {pageCount < 2 ? null : (
            <StepIndicator
              currentPageIndex={currentPageIndex}
              pageCount={pageCount}
              onGotoPage={onGoToPage}
            />
          )}
          {currentPageIndex === pageCount - 1 ? (
            <a onClick={onFinish}>
              <T id="tutorial.standardPage.finish" m="Finish" />
            </a>
          ) : (
            <a onClick={onNextPage}>
              <T id="tutorial.standardPage.nextPage" m="Next" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
