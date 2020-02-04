const ShowWarning = ({ warn, className }) => (
  <div className={"warning " + className}>{warn}</div>
);

ShowWarning.propTypes = {
  warn: PropTypes.object.isRequired
};

export default ShowWarning;
