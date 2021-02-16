import { classNames } from "pi-ui";
import styles from "./Charts.module.css";
import { useChart } from "./hooks";

const MeteredChart = ({
  additive,
  blueLabel,
  blueValue,
  blackLabel,
  blackValue
}) => {
  const { sidebarOnBottom } = useChart();
  const ticksCount = sidebarOnBottom ? 62 : 100;
  const createTicks = (additive, blueValue, blackValue) => {
    const ticks = [];
    let blueTicks;
    let blackTicks;
    if (additive) {
      blueTicks = (blueValue / (blueValue + blackValue)) * ticksCount;
      blackTicks = ticksCount - blueTicks;
    } else {
      blueTicks = blueValue;
      blackTicks = blackValue;
    }
    for (let i = 0; i < blueTicks; i++) {
      ticks.push(
        <div
          key={"blue-ticks-" + i}
          className={classNames(styles.meteredTicks, styles.blueTick)}
        />
      );
    }
    for (let j = 0; j < blackTicks; j++) {
      ticks.push(
        <div
          key={"black-ticks-" + j}
          className={classNames(styles.meteredTicks, styles.blackTick)}
        />
      );
    }
    return ticks;
  };

  return (
    <>
      <div className={styles.meteredTicksArea}>
        {createTicks(additive, blueValue, blackValue)}
      </div>
      <div className={styles.meteredChartLegend}>
        <div className={styles.blueLegend}>
          <div className={styles.legendLabel}>{blueLabel}</div>
          <div className={styles.legendValue}>{blueValue}</div>
        </div>
        <div className={styles.blackLegend}>
          <div className={styles.legendValue}>{blackValue}</div>
          <div className={styles.legendLabel}>{blackLabel}</div>
        </div>
      </div>
    </>
  );
};

export default MeteredChart;
