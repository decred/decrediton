import ReactDOM from "react-dom";
import cxs from "cxs/component";
import { BaseBox } from "./grid/Box";
import theme from "theme";

const warningStyle = ({ color: theme("colors.white"),    backgroundColor: theme("colors.orange") });
const plainStyle   = ({ color: theme("colors.darkGrey"), backgroundColor: theme("colors.lightestGrey") });
const canSetWidth  = ({ tipWidth }) => tipWidth ? ({ width: tipWidth + "px" }) : null;
const canWarn      = ({ tipWarning }) => tipWarning ? warningStyle : plainStyle;

const Tip = cxs(props =>
  <Box is="span" f={ 13 } p={ 5 } { ...props }/>
)({
  borderRadius: theme("radii.3"),
  boxShadow: theme("shadows.tooltip"),
  zIndex: 1000
}, canWarn, canSetWidth);

Tip.propTypes = {
  tipWidth: PropTypes.number,
  tipWarning: PropTypes.bool
};

const Tooltip = ({ text, tipDisabled, children, ...props }) => {
  let tooltip = document.getElementById("tooltip");

  const onMouseMove = ({clientX, clientY}) => {
    tooltip.style.left =
      clientX + tooltip.clientWidth + 10 < window.innerWidth ?
      clientX + 10 + "px" : window.innerWidth - 5 - tooltip.clientWidth + "px";
    tooltip.style.top =
      clientY + tooltip.clientHeight + 10 < window.innerHeight ?
      clientY + 10 + "px" : window.innerHeight + 5 - tooltip.clientHeight + "px";
  };

  return tipDisabled ? React.cloneElement(children, props) : (
    <BaseBox { ...props } onMouseMove={ onMouseMove }>
      { children }
      { ReactDOM.creatPortal(<Tip>{ text }</Tip>, tooltip) }
    </BaseBox>
  );
};

Tooltip.propTypes = {
  children: PropTypes.element.isRequired
};

export default Tooltip;
