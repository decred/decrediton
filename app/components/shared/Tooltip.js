import React from "react";
import "style/Tooltip.less";

const Tooltip = ({ text, warning, disabled, className, children, tipWidth }) => {
  let tooltip = null;

  const onMouseMove = ({clientX, clientY}) => {
    tooltip.style.left =
      clientX + tooltip.clientWidth + 10 < window.innerWidth ?
      clientX + 10 + "px" : window.innerWidth + 5 - tooltip.clientWidth + "px";
    tooltip.style.top =
      clientY + tooltip.clientHeight + 10 < window.innerHeight ?
      clientY + 10 + "px" : window.innerHeight + 5 - tooltip.clientHeight + "px";
  };

  const container = ["tooltipContainer", className].join(" ");
  const width = tipWidth ? { width: tipWidth + "px" } : {};
  const tip = ["tip", warning ? "warning" : null].join(" ");

  return disabled ? <div className={ className }>{ children }</div> : (
    <div className={ container } onMouseMove={ onMouseMove }>
      { children }
      <span className={ tip } ref={ tip => tooltip = tip } style={ width }>
        { text }
      </span>
    </div>
  );
};

export default Tooltip;
