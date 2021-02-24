import PageButton from "./PageButton";
import ActionButton from "./ActionButton";

const propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  gotoPage: PropTypes.func.isRequired,
  gotoPreviousPage: PropTypes.func.isRequired,
  gotoNextPage: PropTypes.func.isRequired
};

const MediumPaginator = ({
  totalPages,
  currentPage,
  gotoPage,
  gotoPreviousPage,
  gotoNextPage
}) => (
  <div className="paginator">
    <ActionButton direction="previous" onClick={gotoNextPage} />
    {[...Array(totalPages)].map((x, i) => (
      <PageButton
        key={i}
        isCurrent={currentPage === i}
        onClick={gotoPage}
        value={i}
      />
    ))}
    <ActionButton direction="next" onClick={gotoPreviousPage} />
  </div>
);

MediumPaginator.propTypes = propTypes;

export default MediumPaginator;
