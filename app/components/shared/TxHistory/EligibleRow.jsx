import Row from "./Row";

const EligibleRow = ({ className, ...props }) => {
  return <Row {...{ className, ...props }}></Row>;
};

export default EligibleRow;
