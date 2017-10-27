import "style/Tooltip.less";
import { Aux } from "./";
import { BaseBox } from "./grid/Box";

const Tooltip = ({ text, tipWarning, tipDisabled, className, children, tipWidth }) => {
  let tooltip = null;

  const onMouseMove = ({clientX, clientY}) => {
    tooltip.style.left =
      clientX + tooltip.clientWidth + 10 < window.innerWidth ?
      clientX + 10 + "px" : window.innerWidth - 5 - tooltip.clientWidth + "px";
    tooltip.style.top =
      clientY + tooltip.clientHeight + 10 < window.innerHeight ?
      clientY + 10 + "px" : window.innerHeight + 5 - tooltip.clientHeight + "px";
  };

  const container = ["tooltipContainer", className].join(" ");
  const width = tipWidth ? { width: tipWidth + "px" } : {};
  const tip = ["tip", tipWarning ? "warning" : null].join(" ");
  const Wrapper = className ? "div" : Aux;

  return tipDisabled ? <Wrapper className={ className }>{ children }</Wrapper> : (
    <BaseBox className={ container } onMouseMove={ onMouseMove }>
      { children }
      <span className={ tip } ref={ tip => tooltip = tip } style={ width }>
        { text }
      </span>
    </BaseBox>
  );
};

export default Tooltip;
