import icons from "iconMap";
import theme from "theme";

const Icon = ({ i, s }) => {
  const { width, height, path, viewBox, markup } = icons[i];
  const size = (theme.space[s] || s || 20);
  return (
    <div className="icon">
      <svg viewBox={ viewBox || `0 0 ${ width || height } ${ height }` } height={ size }>
        { markup || <path d={ path } /> }
      </svg>
    </div>
  );
};

Icon.propTypes = {
  i: PropTypes.string.isRequired,
  s: PropTypes.number
};

export default Icon;
