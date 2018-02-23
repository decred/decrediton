import LogsForm from "./Form";

@autobind
class Logs extends React.Component {
  render() {
    const secondsLeft = this.props.getEstimatedTimeLeft;
    let finishDateEstimation = null;
    if (secondsLeft !== null) {
      finishDateEstimation = new Date();
      finishDateEstimation.setSeconds(finishDateEstimation.getSeconds() + secondsLeft);
    }
    return (
      <LogsForm
        {...{
          ...this.props,
          finishDateEstimation
        }}
      />
    );
  }
}
export default Logs;
