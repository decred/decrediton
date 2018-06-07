export default class MeteredChart extends React.Component {

  createTicks = (additive, blueValue, blackValue) => {
    let ticks = [];
    const ticksCount = 100;
    if (additive) {
      var blueTicks = blueValue / (blueValue + blackValue) * ticksCount;
      var blackTicks = ticksCount - blueTicks;
    } else {
      blueTicks = blueValue;
      blackTicks = blackValue;
    }
    for (let i = 0; i < blueTicks; i++) {
      ticks.push(<div key={"blue-ticks-"+i} className="metered-ticks blue-tick"/>);
    }
    for (let j = 0; j < blackTicks; j++) {
      ticks.push(<div key={"black-ticks-"+j} className="metered-ticks black-tick"/>);
    }
    return ticks;
  }

  render() {
    const { additive, blueLabel, blueValue, blackLabel, blackValue } = this.props;
    return (
      <Aux>
        <div className="metered-ticks-area">
          {this.createTicks(additive, blueValue, blackValue)}
        </div>
        <div className="metered-chart-legend">
          <div className="blue-legend">
            <div className="legend-label">{blueLabel}</div>
            <div className="legend-value">{blueValue}</div>
          </div>
          <div className="black-legend">
            <div className="legend-value">{blackValue}</div>
            <div className="legend-label">{blackLabel}</div>
          </div>
        </div>
      </Aux>
    );
  }
}
