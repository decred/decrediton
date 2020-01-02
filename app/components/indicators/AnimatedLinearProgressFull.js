import "style/Loading.less";

@autobind
class AnimatedLinearProgressFull extends React.Component {
  render() {
    const { value, min, max, error, getDaemonSynced, text, animationType } = this.props;
    const perComplete = (value-min)/(max-min);
    const leftStartingPoint = perComplete ? perComplete*100 : 0;
    return (
      <div className={"linear-progress " + animationType}>
        { getDaemonSynced ?
          <div className={"linear-progress-bar " + (error ? "error" : null)}
            style={error || getDaemonSynced ? {} : { width: `${perComplete*100}` + "%" }}>
          </div> :
          <>
            <div className={"linear-progress-bar " + ( error && "error" )}
              style={{ width: `${leftStartingPoint}%` }}>
            </div>
            <div className="is-row">
              { perComplete > 0.1  && perComplete < 1 && <div className="linear-progress-box one"    style={{ left: leftStartingPoint  }}/> }
              { perComplete > 0.25 && perComplete < 1 && <div className="linear-progress-box two"    style={{ left: leftStartingPoint + 200 }}/> }
              { perComplete > 0.4  && perComplete < 1 && <div className="linear-progress-box three"  style={{ left: leftStartingPoint + 200 }}/> }
              { perComplete > 0.6  && perComplete < 1 && <div className="linear-progress-box four"   style={{ left: leftStartingPoint + 200 }}/> }
              { perComplete > 0.75 && perComplete < 1 && <div className="linear-progress-box five"   style={{ left: leftStartingPoint + 200 }}/> }
              { perComplete > 0.9  && perComplete < 1 && <div className="linear-progress-box six"    style={{ left: leftStartingPoint + 200 }}/> }
            </div>
          </>}
        <div className={"linear-progress-text " + animationType}>
          {text}
        </div>
      </div>
    );
  }
}

export default AnimatedLinearProgressFull;
