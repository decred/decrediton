const ShowError = ({ error, className }) => !error ? null : (
  <div className={"error" + (className ? (" " + className) : "")}>{error}</div>
);

export default ShowError;
