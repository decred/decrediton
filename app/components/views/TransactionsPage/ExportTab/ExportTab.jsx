import { useState } from "react";
import ExportPage from "./ExportPage/ExportPage";
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { availableExports } from "./helpers";
import { useExportTab } from "./hooks";

export const ExportTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="transactions.description.export"
        m="Export different types of statistics from your wallet."
      />
    }
  />
);

const ExportTab = () => {
  const { exportingData, exportStatToCSV, intl } = useExportTab();
  const [selectedExport, setSelectedExport] = useState(availableExports[0]);
  const [destinationFile, setDestinationFile] = useState("");

  const onExportCSV = () => {
    const opts = {
      calcFunction: selectedExport.calcFunction,
      csvFilename: destinationFile
    };
    exportStatToCSV(opts);
  };
  const onSetDestinationFile = (df) => setDestinationFile(df);
  const onSetSelectedExport = (se) => setSelectedExport(se);

  return (
    <ExportPage
      exportingData={exportingData}
      availableExports={availableExports}
      selectedExport={selectedExport}
      destinationFile={destinationFile}
      setDestinationFile={onSetDestinationFile}
      onExportCSV={onExportCSV}
      onChangeSelectedExport={onSetSelectedExport}
      intl={intl}
    />
  );
};

export default ExportTab;
