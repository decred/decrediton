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
class MediumPaginator extends React.Component {

  render() {
    return (
      <div className="paginator">
        <ActionButton direction="previous" onClick={this.props.gotoNextPage} />
        {[ ...Array(this.props.totalPages) ].map( (x, i) => (
          <PageButton
            key={i}
            isCurrent={this.props.currentPage === i}
            onClick={this.props.gotoPage}
            value={i}/>
        ))}
        <ActionButton direction="next" onClick={this.props.gotoPreviousPage} />
      </div>
    );
  }
}

MediumPaginator.propTypes = propTypes;

export default MediumPaginator;
