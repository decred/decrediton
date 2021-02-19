import GetStartedHeader from "./GetStarted";
import StandardHeader from "./Header";

const Header = ({
  getStarted,
  headerTop,
  headerTitleOverview,
  headerMetaOverview,
  children
}) => {
  const Component = getStarted ? GetStartedHeader : StandardHeader;
  return (
    <Component
      {...{
        headerTop,
        headerTitleOverview,
        headerMetaOverview,
        children
      }}
    />
  );
};

export default Header;
