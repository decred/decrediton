import "style/Loading.less";

@autobind
class AnimatedLinearProgressFull extends React.Component {
  render() {
    const { value, min, max, error, disabled, getDaemonSynced, text, animationType } = this.props;
    const perComplete = (value-min)/(max-min);
    const leftStartingPoint = perComplete*95 + "%";
    return (
      <div className="linear-progress">
        { (getDaemonSynced || !disabled) &&
          <div className={error ? "linear-progress-bar error" : "linear-progress-bar"} style={error || getDaemonSynced ? {} : { width: `${perComplete*100}` + "%" }}>
            { (!getDaemonSynced && !error) &&
              <Aux>
                { perComplete > 0.1  && perComplete < 1 && <div className="linear-progress-box one"    style={{ left: leftStartingPoint }}/> }
                { perComplete > 0.25 && perComplete < 1 && <div className="linear-progress-box two"    style={{ left: leftStartingPoint }}/> }
                { perComplete > 0.4  && perComplete < 1 && <div className="linear-progress-box three"  style={{ left: leftStartingPoint }}/> }
                { perComplete > 0.6  && perComplete < 1 && <div className="linear-progress-box four"   style={{ left: leftStartingPoint }}/> }
                { perComplete > 0.75 && perComplete < 1 && <div className="linear-progress-box five"   style={{ left: leftStartingPoint }}/> }
                { perComplete > 0.9  && perComplete < 1 && <div className="linear-progress-box six"    style={{ left: leftStartingPoint }}/> }
              </Aux>
            }
          </div>
        }
        <div className={(getDaemonSynced || !disabled) ? "linear-progress-text loading " + animationType : "linear-progress-text " + animationType }>
          {text}
        </div>
      </div>
    );
  }
}

export default AnimatedLinearProgressFull;
