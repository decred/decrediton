import { themes } from "./themes";
import { endOfDay } from "helpers";

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
  if(indicator >= 0 && indicator < 20) {
    return 0;
  } else if (indicator >= 20 && indicator < 40){
    return 1;
  } else if (indicator >= 40 && indicator < 60) {
    return 2;
  } else if (indicator >= 60 && indicator < 80) {
    return 3;
  } else if (indicator >= 80 && indicator <= 100) {
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
const boxWidth = 10;
const boxMargin = 2;
const textHeight = 15;
const defaultFontFace = "IBM Plex Mono";
const headerHeight = 60;
const canvasMargin = 20;
const yearHeight = textHeight + (boxWidth + boxMargin) * 8 + canvasMargin;
const scaleFactor = window.devicePixelRatio || 1;

function drawInfo(ctx, opts = {}) {
  const {
    offsetX = 0,
    offsetY = 0,
    graphEntries,
    fontFace = defaultFontFace
  } = opts;
  const theme = getTheme();

  ctx.textBaseline = "hanging";
  ctx.fillStyle = theme.text;
  ctx.font = `10px '${fontFace}'`;
  ctx.fillText(
    `${graphEntries[0].date}`,
    offsetX,
    offsetY - 17
  );

  for (let i = 0; i < graphEntries.length / 7; i++) {
    for (let j = 0; j < 7; j++) {
      const dayIndex = i+j + j*7;
      const day = graphEntries[dayIndex];
      const color = theme[`grade${day.intensity}`];
      ctx.fillStyle = color;

      ctx.fillRect(
        offsetX + (boxWidth + boxMargin) * i ,
        // offsetY + textHeight + (boxWidth + boxMargin) * j,
        50+textHeight + (boxWidth + boxMargin) * j,
        10,
        10
      );
    }
  }

  // Draw Month Label
  let lastCountedMonth = 0;
  for (let y = 0; y < graphEntries[0].length; y += 1) {
    const date = moment(graphEntries[0][y].date);
    const month = date.month() + 1;
    const firstMonthIsDec = month == 12 && y == 0;
    const monthChanged = month !== lastCountedMonth;
    if (monthChanged && !firstMonthIsDec) {
      ctx.fillStyle = theme.meta;
      ctx.fillText(date.format('MMM'), offsetX + (boxWidth + boxMargin) * y, offsetY);
      lastCountedMonth = month;
    }
  }
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

export function drawContributions(canvas, opts) {
  const { data } = opts;
  const height = yearHeight + canvasMargin + headerHeight + 10;
  const width = 53 * (boxWidth + boxMargin) + canvasMargin * 2;

  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;

  const ctx = canvas.getContext("2d");
  ctx.scale(scaleFactor, scaleFactor);
  ctx.textBaseline = "hanging";

  drawMetaData(ctx, {
    ...opts,
    width,
    height
  });

  const graphEntries = [];
  for (let i = 0; i < data.length; i++) {
    graphEntries.push({ ...data[i] });
  }

  addIntensityInfo(graphEntries);

  const offsetY = yearHeight + canvasMargin + headerHeight;
  const offsetX = canvasMargin;
  drawInfo(ctx, {
    ...opts,
    offsetX,
    offsetY,
    graphEntries,
  });
}