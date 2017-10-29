import cxs from "cxs/component";
import theme from "theme";

const warningStyle = ({ color: theme("colors.white"),    backgroundColor: theme("colors.orange") });
const plainStyle   = ({ color: theme("colors.darkGrey"), backgroundColor: theme("colors.lightestGrey") });
const canSetWidth  = ({ tipWidth }) => tipWidth ? ({ width: tipWidth + "px" }) : null;
const canWarn      = ({ tipWarning }) => tipWarning ? warningStyle : plainStyle;

const Tip = cxs("div")({
  fontSize: "13px",
  padding: "5px",
  borderRadius: theme("radii.3"),
  boxShadow: theme("shadows.tooltip"),
  zIndex: 1000
}, canWarn, canSetWidth);

Tip.propTypes = {
  tipWidth: PropTypes.number,
  tipWarning: PropTypes.bool
};

Tip.displayName = "Tip";

export default Tip;
