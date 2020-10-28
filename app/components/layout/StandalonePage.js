import StandalonePageBody from "./StandalonePageBody";
import { classNames } from "pi-ui";

export default ({ header, children, className }) => {
  const body = header ? (
    <StandalonePageBody>{children}</StandalonePageBody>
  ) : (
    children
  );

  return (
    <div className={classNames("standalone-page", className)}>
      {header}
      {body}
    </div>
  );
};
