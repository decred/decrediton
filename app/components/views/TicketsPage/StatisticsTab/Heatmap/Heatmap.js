import { themes } from "./themes";
import { endOfDay } from "helpers";
import { Tooltip } from "shared";
import "style/Heatmap.less";

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
  let squares = [];
  const numberOfRows = Math.ceil(graphEntries.length/7);

  for (let j = 0; j < 7; j++) {
    for (let i = 0; i < numberOfRows ; i++) {
      const dayIndex = j + i*7;

      if (dayIndex >= graphEntries.length) {
        continue;
      }
      const day = graphEntries[dayIndex];
      const color = theme[`grade${day.intensity}`];
      const divEl = (
        <Tooltip text={JSON.stringify(day)}>
          <div style={{ background: color, width: boxWidth, height: boxWidth,
          position: "absolute", fontSize: 8,
          left: offsetX + (boxWidth + 5) * i,
          top: offsetY + textHeight + (boxWidth + 5) * j }} />  
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
  const graphEntries = [];
  for (let i = 0; i < data.length; i++) {
    graphEntries.push({ ...data[i] });
  }

  addIntensityInfo(graphEntries);

  const offsetY = canvasMargin + headerHeight;
  const offsetX = canvasMargin;

  return (
    <div className="heatmap-wrapper">
      {drawInfo({graphEntries, offsetX, offsetY, ...opts })}
    </div>
  )
}

export default Heatmap;