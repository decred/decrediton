import ChannelDetails from "./ChannelDetails";
import { Header } from "./helpers";
import { StandalonePage } from "layout";

const ChannelDetailsPage = () => {
  return (
    <StandalonePage header={<Header />}>
      <ChannelDetails />
    </StandalonePage>
  );
};

export default ChannelDetailsPage;
