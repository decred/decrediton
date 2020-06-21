import { newProposalCounts } from "connectors";
import { useMenuLinks } from "./hooks";
import MenuList from "./MenuList";

// number of link in a row when sidebar is at bottom.
// const LINK_PER_ROW = 4;

function MenuLinks() {
  const { uiAnimations, getAnimatedCaret, getStaticCaret } = useMenuLinks();

  return (
    <>
      <MenuList />
      {uiAnimations ? getAnimatedCaret : getStaticCaret}
    </>
  );
}

export default newProposalCounts(MenuLinks);
