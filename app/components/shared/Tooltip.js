import React from "react";
import cxs from "cxs";
import { Box } from "shared";
import theme from "theme";

const px = n => typeof n === "number" ? n + "px" : n;

const tooltipContainer = cxs({
  display: "inline-block",
  ":hover": {
    " > span": {
      display: "block"
    }
  }
});

const { radii, shadows, colors: { lightestGrey, darkGrey }} = theme;

const tip = cxs({
  position: "fixed",
  whiteSpace: "nowrap",
  display: "none",
  background: lightestGrey,
  color: darkGrey,
  borderRadius: px(radii[2]),
  boxShadow: shadows[0],
  padding: px(5),
  zIndex: 1000
});

const Tooltip = ({ text, children }) => {
  let tooltip = null;

  const onMouseMove = ({clientX, clientY}) => {
    tooltip.style.left =
      clientX + tooltip.clientWidth + 10 < window.innerWidth ?
      clientX + 10 + "px" : window.innerWidth + 5 - tooltip.clientWidth + "px";
    tooltip.style.top =
      clientY + tooltip.clientHeight + 10 < window.innerHeight ?
      clientY + 10 + "px" : window.innerHeight + 5 - tooltip.clientHeight + "px";
  };

  return (
    <Box className={ tooltipContainer } onMouseMove={ onMouseMove }>
      { children }
      <span className={ tip } ref={ tip => tooltip = tip }>
        { text }
      </span>
    </Box>
  );
};

export default Tooltip;
