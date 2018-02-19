import "style/MiscComponents.less";

export const UnselectableText = ({ children, ...props }) =>
  <p data-pseudo-content={children} {...props}/>;

UnselectableText.propTypes = {
  children: PropTypes.string.isRequired,
};

export default UnselectableText;
