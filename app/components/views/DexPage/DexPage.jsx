import { useDex } from "./hooks";
import { StandalonePage } from "layout";

const DexPage = () => {
  const { Page, Header } = useDex();
  return <StandalonePage header={Header}>{Page}</StandalonePage>;
};

export default DexPage;
