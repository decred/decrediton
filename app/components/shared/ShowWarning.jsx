import { classNames } from "pi-ui";

const ShowWarning = ({ warn, className }) => (
  <div className={classNames("warning", className)}>{warn}</div>
);

ShowWarning.propTypes = {
  warn: PropTypes.object.isRequired
};

export default ShowWarning;
