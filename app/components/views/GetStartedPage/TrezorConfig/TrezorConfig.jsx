import { useEffect } from "react";
import Page from "./Page";
import { useTrezorPage } from "views/TrezorPage/hooks";
import TrezorPageContent from "views/TrezorPage/TrezorPageContent";

const TrezorConfig = ({ onSendBack }) => {
  const { enableTrezor } = useTrezorPage();

  useEffect(() => {
    enableTrezor();
  }, [enableTrezor]);

  return (
    <Page onSendBack={onSendBack}>
      <TrezorPageContent />
    </Page>
  );
};

export default TrezorConfig;
