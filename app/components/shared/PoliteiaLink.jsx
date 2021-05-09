import { useMemo, useCallback } from "react";
import * as wallet from "wallet";
import { Link } from "pi-ui";

const PoliteiaLink = ({
  children,
  path,
  className,
  isTestnet,
  CustomComponent,
  hrefProp
}) => {
  const href = useMemo(
    () =>
      hrefProp
        ? hrefProp
        : `https://${isTestnet ? "test-proposals" : "proposals"}.decred.org${
            path || ""
          }`,
    [isTestnet, path, hrefProp]
  );
  const onClickHandler = useCallback(() => wallet.openExternalURL(href), [
    href
  ]);
  return (
    <Link
      onClick={onClickHandler}
      className={className}
      size="md"
      customComponent={
        CustomComponent
          ? (props) => <CustomComponent {...props}>{children}</CustomComponent>
          : null
      }>
      {children}
    </Link>
  );
};

export default PoliteiaLink;
