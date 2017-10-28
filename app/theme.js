import { Component, createElement as h } from "react";
import { get } from "fp";
import PropTypes from "prop-types";

const colors = {
  // Primary Colors
  white:        "#fff",
  blue:         "#2971ff",
  turquiose:    "#2ed8a3",
  dark:         "#0c1e3e",
  // Accent Colors
  AltBlue:      "#69d3f5",
  AltBlue2:     "#2252a3",
  lightBlue:    "#e9f8f3",
  green:        "#41bf53",
  lightGreen:   "#c6eccb",
  orange:       "#fd714a",
  lightOrange:  "#feb8a5",
  black:        "#09182d",
  darkGrey:     "#596d81",
  grey:         "#c4cbd2",
  lightGrey:    "#e7eaed",
  lightestGrey: "#f3f6f6",
  gradient:     "linear-gradient(0deg, #2971ff, #2ed6a1)",
};

const styles = {
  colors: {
    tooltipBg:    colors.lightestGrey,
    tooltip:      colors.darkGrey,
    heading:      colors.darkGrey,
    iconBase:     "#8795A2",
    iconActive:   "#2970FF",
    ...colors
  },

  font: "Source Sans Pro",
  fontSizes: [11,12,13,14,15,16,17,18,19,20,23,25,27,35,53],
  // fontSizes: [10,12,13,18,24,34]
  fontWeights: {
    normal: 500
  },
  monospace: "Inconsolata",
  radii: [0, 2, 3, 5, 10],
  radius: { circle: "50%" },
  shadows: {
    tooltip: "3px 3px 6px 0px rgba(0,0,0,0.16)"
  },
  // TODO: Create a consistent spacing scale
  space: [],
};

const getStyles = key => get(key, styles);

export const theme = Object.assign(getStyles, styles);

class ThemeProvider extends Component {
  getChildContext () { return ({ theme: theme }); }
  render () { return h("div", null, this.props.children); }
}

ThemeProvider.childContextTypes = { theme: PropTypes.func };

export default ThemeProvider;
