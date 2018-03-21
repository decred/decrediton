export default ({ expanded, onClick, style }) => (
  <a
    className={[ "vertical-expand", expanded ? "expanded" : "" ].join(" ")}
    onClick={onClick}
    style={style}
  />
);
