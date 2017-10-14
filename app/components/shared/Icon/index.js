import React from "react";
import PropTypes from "prop-types";
import cxs from "cxs/component";
import icons from "iconMap";
import { Box } from "grid";

const clickableStyle = { cursor: "pointer", ":hover": { opacity: 0.7 }};

const changeColorOnActive = ({ active, theme: { colors: { iconActive, iconBase }}}) => ({ color: active ? iconActive : iconBase });

const mayClick = ({ onClick }) => onClick ? clickableStyle : null;

const Svg = cxs("svg")({ fill: "currentColor" });

const IconBox = cxs(Box)(changeColorOnActive, mayClick);

IconBox.propTypes = { active: PropTypes.bool };

const Icon = ({ i, s, ...props }) => {
  const { width, height, path, markup } = icons[i];
  const Tag = markup ? "svg" : Svg;
  const size = (s || 1/2);
  return (
    <IconBox is="span" { ...props }>
      <Tag viewBox={ `0 0 ${height} ${width}` } height={ height * size } width={ width * size }>
        { markup || <path d={ path } /> }
      </Tag>
    </IconBox>
  );
};

Icon.propTypes = {
  i: PropTypes.string.isRequired,
  s: PropTypes.number
};

export default Icon;
