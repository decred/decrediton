import { themes } from "./themes";
import TooltipInfo from "./TooltipInfo";
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/Heatmap.less";

const MONTHS = [
  <T id="heatmap.month.0" m="Jan" />,
  <T id="heatmap.month.1" m="Feb" />,
  <T id="heatmap.month.2" m="Mar" />,
  <T id="heatmap.month.3" m="Apr" />,
  <T id="heatmap.month.4" m="May" />,
  <T id="heatmap.month.5" m="Jun" />,
  <T id="heatmap.month.6" m="Jul" />,
  <T id="heatmap.month.7" m="Aug" />,
  <T id="heatmap.month.8" m="Sep" />,
  <T id="heatmap.month.9" m="Oct" />,
  <T id="heatmap.month.10" m="Nov" />,
  <T id="heatmap.month.11" m="Dec" />,
]

function getTheme(opts = {}) {
  return themes.standard;
}

const getBiggestCount = (graphEntries) => {
  let biggest = 0;
  for(let i = 0; i < graphEntries.length; i++) {
    if (graphEntries[i].count > biggest) {
      biggest = graphEntries[i].count;
    }
  }
  return biggest;
}

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
}

const addIntensityInfo = (graphEntries) => {
  const biggestCount = getBiggestCount(graphEntries);
  for(let i = 0; i < graphEntries.length; i++) {
    const ind = 100 * graphEntries[i].count / biggestCount;
    graphEntries[i].intensity = getIntensity(ind);    
  }
}

const DATE_FORMAT = "YYYY-MM-DD";
const boxWidth = 20;
const boxMargin = 2;
const textHeight = 15;
const defaultFontFace = "IBM Plex Mono";
const headerHeight = 60;
const canvasMargin = 20;
const scaleFactor = window.devicePixelRatio || 1;

function drawInfo(opts = {}) {
  const {
    offsetX = 0,
    offsetY = 0,
    graphEntries,
  } = opts;
  const theme = getTheme();
  const squares = [];
  const numberOfRows = Math.ceil(graphEntries.length/7);
  for (let j = 0; j < 7; j++) {
    for (let i = 0; i < numberOfRows ; i++) {
      const dayIndex = j + i*7;
      if (dayIndex >= graphEntries.length) {
        continue;
      }
      graphEntries[dayIndex].left = offsetX + (boxWidth + 5) * i;
      const day = graphEntries[dayIndex];
      const dayDate = new Date(day.date);
      const color = theme[`grade${day.intensity}`];
      const divEl = (
        <Tooltip
          text={<TooltipInfo {...{ dayDate, month: MONTHS[dayDate.getMonth()],  ...day }} /> } key={ "index"+dayIndex }>
          <div style={{ background: color, width: boxWidth, height: boxWidth,
          position: "absolute", left: offsetX + (boxWidth + 5) * i,
          top: offsetY + textHeight + (boxWidth + 5) * j }} />
        </Tooltip>);
      squares.push(divEl)
    }
  }

  // add month label
  let lastDateCounted = graphEntries[0] && new Date(graphEntries[0].date);
  for(let i = 0; i < graphEntries.length; i++) {
    const date = new Date(graphEntries[i].date);
    if (lastDateCounted.getMonth() !== date.getMonth()) {
      lastDateCounted = date;
      const divEl = (
        <Tooltip text={date.getMonth()} key={ "month"+i }>
          <div style={{ position: "absolute", fontSize: 10,
          left: graphEntries[i].left,
          top: offsetY - 5 }} >{MONTHS[date.getMonth()]}</div>
        </Tooltip>);
      squares.push(divEl)
    }
  }

  return squares;
}

function drawMetaData(ctx, opts = {}) {
  const {
    username,
    width,
    height,
    footerText,
    fontFace = defaultFontFace
  } = opts;
  const theme = getTheme(opts);
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);

  if (footerText) {
    ctx.fillStyle = theme.meta;
    ctx.textBaseline = "bottom";
    ctx.font = `10px '${fontFace}'`;
    ctx.fillText(footerText, canvasMargin, height - 5);
  }

  // chart legend
  let themeGrades = 5;
  ctx.fillStyle = theme.text;
  ctx.fillText('Less', width - canvasMargin - (boxWidth + boxMargin) * (themeGrades) - 55, 37);
  ctx.fillText('More', (width - canvasMargin) - 25, 37);
  for (let x = 0; x < 5; x += 1) {
    ctx.fillStyle = theme[`grade${x}`];
    ctx.fillRect(width - canvasMargin - (boxWidth + boxMargin) * (themeGrades) - 27,textHeight + boxWidth,10,10);
    themeGrades -= 1;
  }

  ctx.fillStyle = theme.text;
  ctx.textBaseline = "hanging";
  ctx.font = `20px '${fontFace}'`;
  ctx.fillText(`@${username} on GitHub`, canvasMargin, canvasMargin);

  ctx.beginPath();
  ctx.moveTo(canvasMargin, 55);
  ctx.lineTo(width - canvasMargin, 55);
  ctx.strokeStyle = theme.grade0;
  ctx.stroke();
}

const Heatmap = ({ data, ...opts }) => {
  addIntensityInfo(data);

  const offsetY = canvasMargin + headerHeight;
  const offsetX = canvasMargin;

  return (
    <div className="heatmap-wrapper">
      {drawInfo({ graphEntries: data, offsetX, offsetY, ...opts })}
    </div>
  )
}

export default Heatmap;