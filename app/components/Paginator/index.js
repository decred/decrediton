import { substruct } from "fp";
import SmallPaginator from "./SmallPaginator";
import MediumPaginator from "./MediumPaginator";
import LargePaginator from "./LargePaginator";
import "style/Paginator.less";

const propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChanged: PropTypes.func.isRequired
};

@autobind
class Paginator extends React.Component {

  constructor(props) {
    super(props);
  }

  gotoPage(pageNumber) {
    this.props.onPageChanged(pageNumber, Math.sign(pageNumber - this.props.currentPage));
  }

  gotoNextPage() {
    if (this.props.currentPage < this.props.totalPages-1) {
      this.props.onPageChanged(this.props.currentPage +1, +1);
    }
  }

  gotoPreviousPage() {
    if (this.props.currentPage > 0) {
      this.props.onPageChanged(this.props.currentPage -1, -1);
    }
  }

  render() {
    const Component = this.props.totalPages < 10
      ? SmallPaginator
      : this.props.totalPages == 11
        ? MediumPaginator
        : LargePaginator;

    return (
      this.props.totalPages > 1 &&
      <Component
        {...{
          ...this.props,
          ...this.state,
          ...substruct({
            gotoPage: null,
            gotoNextPage: null,
            gotoPreviousPage: null
          }, this)
        }}
      />
    );
  }
}

Paginator.propTypes = propTypes;

export default Paginator;
