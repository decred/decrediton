import { Motion } from "react-motion";
import { injectState } from "freactal";
import { Aux } from "../";
import state from "./state";
import "style/Tooltip.less";

const px = n => n + "px";
const mx = ({ top, left, opacity }, width) => ({ top: px(top), left: px(left), opacity, ...width });

const Tooltip = ({ text, warning, disabled, className, tipWidth, children, state: { position }, effects: { updatePosition, onMouseEnter, onMouseLeave }}) => {
  let tooltip = null;

  const onMouseMove = ({ clientX, clientY }) => updatePosition(tooltip, clientX, clientY);
  const container = ["tooltipContainer", className].join(" ");
  const tip = ["tip", warning ? "warning" : null].join(" ");
  const Wrapper = className ? "div" : Aux;
  const width = tipWidth ? { width: tipWidth + "px" } : {};

  return disabled ? <Wrapper className={ className }>{ children }</Wrapper> : (
    <div className={ container } {...{ onMouseMove, onMouseEnter, onMouseLeave }} >
        { children }
      <Motion style={ position }>
        { style => <div style={ mx(style, width) } className={ tip } ref={ tip => tooltip = tip }>{ text }</div> }
      </Motion>
    </div>
  );
};

export default state(injectState(Tooltip));

