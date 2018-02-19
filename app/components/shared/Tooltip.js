import "style/Tooltip.less";

const Tooltip = ({ text, warning, disabled, className, children, md }) => {
  let tooltip = null;

  const onMouseMove = ({ clientX, clientY }) => {
    tooltip.style.left =
      clientX + tooltip.clientWidth + 10 < window.innerWidth ?
        clientX + 10 + "px" : window.innerWidth - 5 - tooltip.clientWidth + "px";
    tooltip.style.top =
      clientY + tooltip.clientHeight + 10 < window.innerHeight ?
        clientY + 10 + "px" : window.innerHeight - 5 - tooltip.clientHeight + "px";
  };

  const widthClass = md ? "tooltip-width-md" : "";
  const container = [ "tooltipContainer", className, widthClass ].join(" ");
  const tip = [ "tip", warning ? "warning" : null ].join(" ");
  const Wrapper = className ? "div" : Aux;

  return disabled ? <Wrapper className={ className }>{ children }</Wrapper> : (
    <div className={ container } onMouseMove={ onMouseMove }>
      { children }
      <span className={ tip } ref={ tip => tooltip = tip }>
        { text }
      </span>
    </div>
  );
};

export default Tooltip;
