import AgendaDetails from "./AgendaDetails";
import { Header } from "./helpers";
import { StandalonePage } from "layout";

const AgendaDetailsPage = () => {
  return (
    <StandalonePage header={<Header />}>
      <AgendaDetails />
    </StandalonePage>
  );
};

export default AgendaDetailsPage;
