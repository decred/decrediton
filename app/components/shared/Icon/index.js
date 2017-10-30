import cxs from "cxs/component";
import { Box } from "shared";
import icons from "iconMap";
import theme from "theme";

const clickableStyle      = { cursor: "pointer", ":hover": { opacity: 0.7 }};
const mayClick            = ({ onClick }) => onClick ? clickableStyle : null;
const changeColorOnActive = ({ active, theme }) => ({ color: active ? theme("colors.iconActive") : theme("colors.iconBase") });

const Svg     = cxs("svg")({ fill: "currentColor" });
const IconBox = cxs(Box)(changeColorOnActive, mayClick);

Svg.displayName = "Svg";
IconBox.propTypes = { active: PropTypes.bool };
IconBox.displayName = "IconBox";

const Icon = ({ i, s, ...props }) => {
  const { width, height, path, viewBox, markup } = icons[i];
  const Tag = markup ? "svg" : Svg;
  const size = (theme.space[s] || s || 20);
  return (
    <IconBox is="span" { ...props }>
      <Tag viewBox={ viewBox || `0 0 ${height} ${(width || height)}` } height={ size }>
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
