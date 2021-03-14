import { classNames } from "pi-ui";

const ShowError = ({ error, className }) =>
  !error ? null : <div className={classNames("error", className)}>{error}</div>;

export default ShowError;
