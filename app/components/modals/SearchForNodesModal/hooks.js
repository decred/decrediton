import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";
import { useIntl } from "react-intl";

export function useSearchForNodesModal() {
  const [node, setNode] = useState(null);
  const describeGraph = useSelector(sel.lnDescribeGraph);
  const searchResults = useMemo(
    () =>
      describeGraph?.nodeList?.filter(
        (n) =>
          node &&
          (n.alias.toLowerCase().indexOf(node?.toLowerCase()) !== -1 ||
            n.pubKey.toLowerCase().indexOf(node?.toLowerCase()) !== -1)
      ),
    [node, describeGraph]
  );

  const intl = useIntl();

  return {
    node,
    setNode,
    searchResults,
    intl
  };
}
