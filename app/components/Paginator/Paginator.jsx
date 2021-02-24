import SmallPaginator from "./SmallPaginator";
import MediumPaginator from "./MediumPaginator";
import LargePaginator from "./LargePaginator";
import "style/Paginator.less";

const propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChanged: PropTypes.func.isRequired
};

const Paginator = ({ onPageChanged, currentPage, totalPages, ...props }) => {
  const gotoPage = (pageNumber) => {
    onPageChanged(pageNumber, Math.sign(pageNumber - currentPage));
  };

  const gotoNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChanged(currentPage + 1, +1);
    }
  };

  const gotoPreviousPage = () => {
    if (currentPage > 0) {
      onPageChanged(currentPage - 1, -1);
    }
  };

  const Component =
    totalPages < 10
      ? SmallPaginator
      : totalPages == 11
      ? MediumPaginator
      : LargePaginator;

  return (
    totalPages > 1 && (
      <Component
        {...{
          ...props,
          gotoPage,
          gotoNextPage,
          gotoPreviousPage
        }}
      />
    )
  );
};

Paginator.propTypes = propTypes;

export default Paginator;
