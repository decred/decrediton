import PageButton from "./PageButton";
import ActionButton from "./ActionButton";

const propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  gotoPage: PropTypes.func.isRequired,
  gotoPreviousPage: PropTypes.func.isRequired,
  gotoNextPage: PropTypes.func.isRequired
};

@autobind
class LargePaginator extends React.Component {

  render() {
    let pages = [];
    if (this.props.currentPage < 6) {
      pages.push(0, 1, 2, 3, 4, 5, 6, 7, 8, "...", this.props.totalPages-1);
    } else if (this.props.currentPage > this.props.totalPages - 8) {
      pages = [ -9, -8, -7, -6, -5, -4, -3, -2, -1 ].map(x => this.props.totalPages + x);
      pages.unshift(1, "...");
    } else {
      pages = [ -3, -2, -1, 0, 1, 2, 3 ].map(x => this.props.currentPage + x);
      pages.unshift(0, "...");
      pages.push("...", this.props.totalPages-1);
    }

    return (
      <div className="paginator">
        <ActionButton direction="previous" onClick={this.props.gotoPreviousPage} />
        {pages.map( (pageNumber, i) => (
          <PageButton
            isCurrent={this.props.currentPage === pageNumber}
            disabled={pageNumber === "..."}
            key={i}
            onClick={this.props.gotoPage}
            value={pageNumber}/>
        ))}
        <ActionButton direction="next" onClick={this.props.gotoNextPage} />
      </div>
    );
  }
}

LargePaginator.propTypes = propTypes;

export default LargePaginator;
