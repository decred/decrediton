import { useMemo, useCallback } from "react";
import { shell } from "electron";
import { Link } from "pi-ui";

export default ({ children, path, className, isTestnet, CustomComponent }) => {
  const href = useMemo(
    () =>
      `https://${isTestnet ? "test-proposals" : "proposals"}.decred.org${
        path || ""
      }`,
    [isTestnet, path]
  );
  const onClickHandler = useCallback(() => shell.openExternal(href), [href]);
  return (
    <Link
      onClick={onClickHandler}
      className={className}
      size="sm"
      customComponent={
        CustomComponent
          ? (props) => <CustomComponent {...props}>{children}</CustomComponent>
          : null
      }>
      {children}
    </Link>
  );
};
