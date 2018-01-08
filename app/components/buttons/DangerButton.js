const DangerButton = ({ className, style, block, type, disabled, onClick, children }) => (
  <div
    className={"danger-button" + (className ? (" " + className) : "")}
    style={({...style, display: block ? "block" : undefined })}
    {...{ type, disabled, onClick }}
  >{children}</div>
);

export default DangerButton;
