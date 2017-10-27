import ReactDOM from "react-dom";

const tip = document.getElementById("tooltip");

const Tip = props => {
  const className = ["tip", warning ? "warning" : null].join(" ");
  return ReactDOM.createPortal(
    <Motion style={ position }>
      { style => <div style={ mx(style, width) } className={ className } ref={ tip => tooltip = tip }>{ text }</div> }
    </Motion>
  , tip);
}

export default Tip;

import { Motion } from "react-motion";
import { injectState } from "freactal";
import { Aux } from "../";
import Tip from "./Tip";
import state from "./state";
import "style/Tooltip.less";

const px = n => n + "px";
const mx = ({ top, left, opacity }, width) => ({ top: px(top), left: px(left), opacity, ...width });

const Tooltip = ({ text, warning, disabled, className, tipWidth, children, state: { position }, effects: { updatePosition, onMouseEnter, onMouseLeave }}) => {
  let tooltip = null;

  const onMouseMove = ({ clientX, clientY }) => updatePosition(tooltip, clientX, clientY);
  const container = ["tooltipContainer", className].join(" ");
  const Wrapper = className ? "div" : Aux;
  const width = tipWidth ? { width: tipWidth + "px" } : {};

  return disabled ? <Wrapper className={ className }>{ children }</Wrapper> : (
    <div className={ container } {...{ onMouseMove, onMouseEnter, onMouseLeave }} >
        { children }
        <Tip {...{ width, warning, position, text }} />
    </div>
  );
};

export default state(injectState(Tooltip));
