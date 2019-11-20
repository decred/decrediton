import { themes } from "./themes";
import TooltipInfo from "./TooltipInfo";
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/Heatmap.less";

const boxWidth = 10;
const boxMargin = 3;
const canvasMargin = 20;
const rowNumber = 7;
const monthLabelSize = 5;
const legendMargin = 10;
const headerHeight = 50;
const Month = ({ date }) => <T id="heatmap.month" m="{date, date, short-month}" values={{ date }} />;

function getTheme() {
  return themes.standard;
}

const getBiggestCount = (graphEntries) => {
  let biggest = 0;
  for (let i = 0; i < graphEntries.length; i++) {
    if (graphEntries[i].count > biggest) {
      biggest = graphEntries[i].count;
    }
  }
  return biggest;
};

const getIntensity = (indicator) => {
  if (indicator === 0) {
    return 0;
  } else if(indicator >= 0 && indicator < 25) {
    return 1;
  } else if (indicator >= 25 && indicator < 50){
    return 2;
  } else if (indicator >= 50 && indicator < 75) {
    return 3;
  } else if (indicator >= 75 && indicator <= 100) {
    return 4;
  }
};

const addIntensityInfo = (graphEntries) => {
  const biggestCount = getBiggestCount(graphEntries);
  for (let i = 0; i < graphEntries.length; i++) {
    const ind = 100 * graphEntries[i].count / biggestCount;
    graphEntries[i].intensity = getIntensity(ind);
  }
};

function drawInfo(opts = {}) {
  const {
    offsetX = 0,
    offsetY = 0,
    graphEntries,
    columnNumber
  } = opts;
  const theme = getTheme();
  const squares = [];
  for (let row = 0; row < rowNumber; row++) {
    for (let col = 0; col < columnNumber ; col++) {
      const dayIndex = row + col * rowNumber;
      if (dayIndex >= graphEntries.length) {
        continue;
      }
      graphEntries[dayIndex].left = offsetX + (boxWidth + boxMargin) * col;
      const day = graphEntries[dayIndex];
      const dayDate = new Date(day.date);
      const color = theme[`grade${day.intensity}`];
      const divEl = (
        <Tooltip
          text={<TooltipInfo {...{ dayDate, ...day }} /> } key={ "index"+dayIndex }>
          <div style={{ background: color, width: boxWidth, height: boxWidth, cursor: "pointer",
            position: "absolute", left: offsetX + (boxWidth + boxMargin) * col,
            top: offsetY + (boxWidth + boxMargin) * row }} />
        </Tooltip>);
      squares.push(divEl);
    }
  }

  // add month label
  let lastDateCounted = graphEntries[0] && new Date(graphEntries[0].date);
  for (let i = 0; i < graphEntries.length; i++) {
    const date = new Date(graphEntries[i].date);
    if (lastDateCounted.getMonth() !== date.getMonth()) {
      lastDateCounted = date;
      const divEl = (
        <div  key={ "month"+i } style={{ position: "absolute", fontSize: 10,
          left: graphEntries[i].left,
          top: offsetY - boxMargin - boxWidth - monthLabelSize }} >{Month({ date })}
        </div>);
      squares.push(divEl);
    }
  }

  return squares;
}

function drawLegend(opts) {
  const { offsetY, offsetX } = opts;
  const legendFontSize = 10;
  const theme = getTheme();
  const legend = [];
  const themeColorNumber = 5;
  const totalBoxWidth = boxWidth + boxMargin;
  const legendWidth = 4*legendFontSize + themeColorNumber*totalBoxWidth;
  const legendStarts = offsetX - legendWidth - legendMargin;

  legend.push(<span key="legend-first" style={{
    fontSize: legendFontSize, position: "absolute",
    top: offsetY - legendFontSize/2, left: legendStarts }}>
      Less
  </span>);
  for (let i = 0; i < themeColorNumber; i++) {
    const color = theme[`grade${i}`];
    const divEl = <div style={{ background: color, width: boxWidth, height: boxWidth,
      position: "absolute", left: legendStarts + 25 + totalBoxWidth * i,
      top: offsetY }} key={"legend"+i} />;

    legend.push(divEl);
  }
  legend.push(<span key="legend-last" style={{
    position: "absolute", top: offsetY - legendFontSize/2, fontSize: legendFontSize,
    left: legendStarts + 25 + totalBoxWidth * themeColorNumber }}>
    More
  </span>);

  return legend;
}

const Heatmap = ({ data, ...opts }) => {
  const columnNumber =  Math.ceil(data.length/rowNumber);
  const offsetY = canvasMargin + headerHeight;
  const offsetX = 0;
  const totalOffsetY = offsetY + rowNumber * (boxMargin + boxWidth) + monthLabelSize + legendMargin;
  const totalOffsetX = canvasMargin + columnNumber * (boxMargin + boxWidth);

  addIntensityInfo(data);
  return (
    <div className = "ticket-activity-wrapper">
      <span className="my-tickets-stats-indicators-title">Ticket Activity</span>
      <div className="heatmap-wrapper">
        {drawInfo({ graphEntries: data, offsetX, offsetY, columnNumber, ...opts })}
        {drawLegend({ offsetY: totalOffsetY, offsetX: totalOffsetX })}
      </div>
    </div>
  );
};

export default Heatmap;
