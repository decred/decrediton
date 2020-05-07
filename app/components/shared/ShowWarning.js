const ShowWarning = ({ warn, className }) => (
  <div className={["warning", className].join(" ")}>{warn}</div>
);

ShowWarning.propTypes = {
  warn: PropTypes.object.isRequired
};

export default ShowWarning;
