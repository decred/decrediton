const InvisibleButton = ({ className, style, block, type, disabled, onClick, children }) => (
  <div
    className={"invisible-button" + (className ? (" " + className) : "")}
    style={({ ...style, display: block ? "block" : undefined })}
    onClick={() => !disabled && onClick && onClick()}
    {...{ type, disabled }}
  >{children}</div>
);

export default InvisibleButton;
