import { FormattedMessage as T } from "react-intl";
import { StepIndicator } from "indicators";

export const StandardPage = ({ image, text, currentPageIndex, pageCount,
  onNextPage, onPreviousPage, onGotoPage, onFinish }) => (

  <div className="tutorial-standard-page">
    <div className="tutorial-text">{text}</div>
    <div className="tutorial-image-and-indicator">
      <div className={[ "tutorial-image", "tutorial-image-" + image ].join(" ")} />
      <div className={"tutorial-page-indicator"}>
        {pageCount < 2
          ? null
          : <a onClick={onPreviousPage}><T id="tutorial.standardPage.previousPage" m="Previous" /></a>
        }
        {pageCount < 2 ? null :
          <StepIndicator
            currentPageIndex={currentPageIndex}
            pageCount={pageCount}
            onGotoPage={onGotoPage}
          />
        }
        {currentPageIndex === pageCount -1
          ? <a onClick={onFinish}><T id="tutorial.standardPage.finish" m="Finish" /></a>
          : <a onClick={onNextPage}><T id="tutorial.standardPage.nextPage" m="Next" /></a>
        }
      </div>
    </div>
  </div>
);

export const MakeStandardPage = (image, text) => (props) =>
  <StandardPage
    {...props}
    text={text}
    image={image}
  />;
