import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton } from "buttons";
import { usePagedTutorial } from "./hooks";
import styles from "./PagedTutorial.module.css";

const PagedTutorial = ({ title, pages }) => {
  const { onGoBackHistory } = usePagedTutorial();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const onNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };
  const onPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };
  const onGoToPage = (index) => {
    if (index > -1 && index < pages.length) {
      setCurrentPageIndex(index);
    }
  };

  const CurrentPageComponent = pages[currentPageIndex];

  return (
    <>
      <InvisibleButton className={styles.closeButton} onClick={onGoBackHistory} />
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>
        <T id="tutorial.subtitle" m="Tutorial" />
      </div>
      <div className={styles.page}>
        <CurrentPageComponent
          currentPageIndex={currentPageIndex}
          pageCount={pages.length}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          onGoToPage={onGoToPage}
          onFinish={onGoBackHistory}
        />
      </div>
    </>
  );

};

export default PagedTutorial;
