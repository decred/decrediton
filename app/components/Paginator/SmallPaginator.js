import PageButton from "./PageButton";

const propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  gotoPage: PropTypes.func.isRequired
};

@autobind
class SmallPaginator extends React.Component {

  render() {
    return (
      <div className="paginator">
        {[ ...Array(this.props.totalPages) ].map( (x, i) => (
          <PageButton
            key={i}
            isCurrent={this.props.currentPage === i}
            onClick={this.props.gotoPage}
            value={i}/>
        ))}
      </div>
    );
  }
}

SmallPaginator.propTypes = propTypes;

export default SmallPaginator;
