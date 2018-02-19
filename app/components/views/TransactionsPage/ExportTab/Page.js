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
    <div className="tab-card export-tab">
      <div className="export-selection">
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

      <p className="export-info-description">{selectedExport.description}</p>
      <h4><T id="export.infoFieldsHeader" m="Exported Fields" /></h4>
      <ul className="export-info-fields">
        {selectedExport.fields.map(p => <FieldDescription key={p.name} {...p} />)}
      </ul>

      <KeyBlueButton onClick={exportCSV} disabled={exportingData || !destinationFile} loading={exportingData}>
        <T id="export.btnExport" m="Export" />
      </KeyBlueButton>
    </div>
  );

export default ExportPage;
