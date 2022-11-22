import { useMemo, useCallback } from "react";
import { wallet } from "wallet-preload-shim";
import { Link } from "pi-ui";

const PoliteiaLink = ({
  children,
  path,
  className,
  isTestnet,
  CustomComponent
}) => {
  const href = useMemo(
    () =>
      `https://${isTestnet ? "test-proposals" : "proposals"}.decred.org${
        path || ""
      }`,
    [isTestnet, path]
  );
  const onClickHandler = useCallback(
    () => wallet.openExternalURL(href),
    [href]
  );
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
