import "style/TextToggle.less";

const Toggle = ({
  leftText,
  rightText,
  activeButton,
  onClick
}) => (
  <div className="text-toggle is-row">
    <div
      className={"text-toggle-button-left" + (activeButton === "left" ? " text-toggle-button-active" : "")}
      onClick={activeButton == "right" ? () => onClick("left") : null}
    >{leftText}</div>
    <div
      className={"text-toggle-button-right" + (activeButton === "right" ? " text-toggle-button-active" : "")}
      onClick={activeButton == "left" ? () => onClick("right") : null}
    >{rightText}</div>
  </div>
);

export default Toggle;
