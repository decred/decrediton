import { Balance } from "shared";
import { balance } from "connectors";
import "style/Chart.less";

const ChartLegend = (props) => {
  const { payload, unitDivisor } = props;
  if (!payload || payload.length === 0 || !payload[0] || !payload[0].payload || !payload[0].payload.legendName) {
    return null;
  }

  const rowLegend = payload[0].payload.legendName;

  return (
    <div className="chart-tooltip">
      <div className="row-legend">{rowLegend}</div>
      {
        payload.map((entry, index) => (
          <div key={`item-${index}`} className="tooltip-line">
            <div className="circle-tooltip" style={{ background:entry.fill }}></div>
            {entry.dataKey}:
            <Balance amount={entry.value * unitDivisor} classNameWrapper="chart-tooltip-value" />
          </div>
        ))
      }
    </div>
  );
};

export default balance(ChartLegend);
