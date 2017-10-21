import React from "react";
import { Motion } from "react-motion";
import state from "./state";
import { injectState } from "freactal";
import "style/Tooltip.less";

const px = n => n + "px";
const mx = ({ top, left, opacity }) => ({ top: px(top), left: px(left), opacity });

const Tooltip = ({ text, children, state: { position, startingPosition }, effects: { updatePosition, onMouseEnter, onMouseLeave }}) => {
  let tooltip = null;

  const onMouseMove = ({ clientX, clientY }) => updatePosition(tooltip, clientX, clientY);

  return (
    <div className="tooltipContainer" {...{ onMouseMove, onMouseEnter, onMouseLeave }} >
      { children }
      <Motion style={ position } defaultStyle={ startingPosition }>
        { style => <div style={ mx(style) } className="tip" ref={ tip => tooltip = tip }>{ text }</div> }
      </Motion>
    </div>
  );
};

export default state(injectState(Tooltip));
