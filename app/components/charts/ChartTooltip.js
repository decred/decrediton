import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/Chart.less";

const ChartLegend = (props) => {
  const { payload } = props;
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
            <T
              id="charts.tooltip.value"
              m="{key}: {value}"
              values={{
                key: entry.dataKey,
                value: <Balance preScaled amount={entry.value} classNameWrapper="chart-tooltip-value" />
              }}
            />
            {/* <div>{`${entry.dataKey}: ${entry.value} ${entry.unit}`}</div> */}
          </div>
        ))
      }
    </div>
  );
};

export default ChartLegend;
