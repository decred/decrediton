export default ({ pageCount, currentPageIndex, onGotoPage }) => (
  <div className="step-indicator">
    {Array(pageCount).fill().map((v, index) => (
      <a
        className={[
          "step",
          index === currentPageIndex
            ? "current"
            :  index < currentPageIndex
              ? "checked"
              : "unchecked",
        ].join(" ")}
        onClick={() => onGotoPage(index)}
        key={index} />
    ))}
  </div>
);
