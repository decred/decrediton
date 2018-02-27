import "style/Loading.less";

@autobind
class LinearProgressFull extends React.Component {

  render() {
    const { barText, value, min, max, error, disabled, full } = this.props;
    const perComplete = value/max-min;
    const leftStartingPoint = perComplete*95 + "%";
    return (
      <div className="linear-progress">
        {!disabled &&
          <div className={error ? "linear-progress-bar error" : "linear-progress-bar"} style={error ? {} : { width: `${perComplete*100}` + "%" }}>
            { !full && !error && perComplete > 0.1  && perComplete < 1 && <div className="linear-progress-box one"    style={{ left: leftStartingPoint }}/> }
            { !full && !error && perComplete > 0.25 && perComplete < 1 && <div className="linear-progress-box two"    style={{ left: leftStartingPoint }}/> }
            { !full && !error && perComplete > 0.4  && perComplete < 1 && <div className="linear-progress-box three"  style={{ left: leftStartingPoint }}/> }
            { !full && !error && perComplete > 0.6  && perComplete < 1 && <div className="linear-progress-box four"   style={{ left: leftStartingPoint }}/> }
            { !full && !error && perComplete > 0.75 && perComplete < 1 && <div className="linear-progress-box five"   style={{ left: leftStartingPoint }}/> }
            { !full && !error && perComplete > 0.9  && perComplete < 1 && <div className="linear-progress-box six"    style={{ left: leftStartingPoint }}/> }
          </div>
        }
        <div className={disabled ? "linear-progress-text" : "linear-progress-text loading"}>
          {barText}
        </div>
      </div>
    );
  }
}

export default LinearProgressFull;
