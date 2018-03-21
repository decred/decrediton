
export const StandardPage = ({ image, text, currentPageIndex, pageCount, onNextPage, onPreviousPage }) => (
  <div className="tutorial-standard-page">
    <div className="tutorial-text">{text}</div>
    <div className={[ "tutorial-image", "tutorial-image-" + image ].join(" ")} />
    <div className={"tutorial-page-indicator"}>
      <a onClick={onPreviousPage}>Previous</a>
      {currentPageIndex+1} / {pageCount}
      <a onClick={onNextPage}>Next</a>
    </div>
  </div>
);

export const MakeStandardPage = (image, text) => (props) =>
  <StandardPage
    {...props}
    text={text}
    image={image}
  />;
