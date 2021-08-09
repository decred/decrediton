import { Tooltip } from "pi-ui";

const TruncatedText = ({ text, max, showTooltip }) => {
  if (max === undefined || max === null || max <= 0) {
    return text;
  }
  const len = text.length;
  if (len <= max) {
    return text;
  } else {
    const middle = Math.ceil(len / 2);
    const left = Math.ceil((len - max) / 2);
    const right = len - max - left;
    const truncated =
      text.substr(0, middle - left) + "..." + text.substr(middle + right);
    return showTooltip ? (
      <Tooltip content={text}>{truncated}</Tooltip>
    ) : (
      truncated
    );
  }
};

TruncatedText.propTypes = {
  text: PropTypes.string.isRequired,
  max: PropTypes.number,
  showTooltip: PropTypes.bool
};

export default TruncatedText;
