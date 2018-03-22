import StandalonePageBody from "./StandalonePageBody";

export default ({ header, children, className }) => {
  const body = header
    ? <StandalonePageBody>{children}</StandalonePageBody>
    : children;

  return (
    <div className={[ "standalone-page", className ? className : "" ].join(" ")} >
      {header}
      {body}
    </div>
  );
};
