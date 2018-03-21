import { StepIndicator } from "indicators";

export const StandardPage = ({ image, text, currentPageIndex, pageCount,
  onNextPage, onPreviousPage, onGotoPage }) => (

  <div className="tutorial-standard-page">
    <div className="tutorial-text">{text}</div>
    <div className="tutorial-image-and-indicator">
      <div className={[ "tutorial-image", "tutorial-image-" + image ].join(" ")} />
      <div className={"tutorial-page-indicator"}>
        <a onClick={onPreviousPage}>Previous</a>
        <StepIndicator
          currentPageIndex={currentPageIndex}
          pageCount={pageCount}
          onGotoPage={onGotoPage}
        />
        <a onClick={onNextPage}>Next</a>
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
