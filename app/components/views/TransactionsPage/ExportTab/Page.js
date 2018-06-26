import Select from "react-select";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";
import { InlineField, PathBrowseInput, FileBrowserFilters } from "inputs";
import "style/ExportPage.less";

const FieldDescription = ({ name, description }) => (
  <li>
    <span className="export-info-field-name">{name}:</span>
    {description}
  </li>
);

const ExportPage =
  ({
    exportingData,
    exportCSV,
    availableExports,
    onChangeSelectedExport,
    selectedExport,
    destinationFile,
    setDestinationFile,
  }) => (
    <Aux>
      <div className="tabbed-page-subtitle"><T id="export.subtitle" m="Export Transactions"/></div>
      <div className="export-area">
        <div className="export-area-left">
          <InlineField label={<T id="export.select" m="Export Type" />}>
            <Select
              clearable={false}
              multi={false}
              valueKey="key"
              labelKey="name"
              value={selectedExport.key}
              options={availableExports}
              onChange={onChangeSelectedExport}
            />
          </InlineField>

          <InlineField label={<T id="export.destination" m="Destination" />}>
            <PathBrowseInput
              save
              type="file"
              value={destinationFile}
              filters={[ FileBrowserFilters.csv, FileBrowserFilters.all ]}
              onChange={(value) => setDestinationFile(value)}
            />
          </InlineField>
        </div>
        <div  className="export-area-right">
          <p className="export-info-description">{selectedExport.description}</p>
          <T id="export.infoFieldsHeader" m="Exported Fields" />
          <ul className="export-info-fields">
            {selectedExport.fields.map(p => <FieldDescription key={p.name} {...p} />)}
          </ul>
        </div>
        <KeyBlueButton onClick={exportCSV} disabled={exportingData || !destinationFile} loading={exportingData}>
          <T id="export.btnExport" m="Export" />
        </KeyBlueButton>
      </div>
    </Aux>
  );

export default ExportPage;
