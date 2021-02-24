import PageButton from "./PageButton";

const propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  gotoPage: PropTypes.func.isRequired
};

const SmallPaginator = ({ totalPages, currentPage, gotoPage }) => (
  <div className="paginator">
    {[...Array(totalPages)].map((x, i) => (
      <PageButton
        key={i}
        isCurrent={currentPage === i}
        onClick={gotoPage}
        value={i}
      />
    ))}
  </div>
);

SmallPaginator.propTypes = propTypes;

export default SmallPaginator;
