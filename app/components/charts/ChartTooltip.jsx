import { Balance } from "shared";
import styles from "./Charts.module.css";
import { useChart } from "./hooks";

const ChartLegend = () => {
  const { payload, unitDivisor } = useChart();
  if (
    !payload ||
    payload.length === 0 ||
    !payload[0] ||
    !payload[0].payload ||
    !payload[0].payload.legendName
  ) {
    return null;
  }

  const rowLegend = payload[0].payload.legendName;

  return (
    <div className={styles.chartTooltip}>
      <div className={styles.rowLegend}>{rowLegend}</div>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className={styles.tooltipLine}>
          <div
            className={styles.circleTooltip}
            style={{ background: entry.fill }}></div>
          {entry.dataKey}:
          <Balance
            amount={entry.value * unitDivisor}
            classNameWrapper={styles.chartTooltipValue}
          />
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;
