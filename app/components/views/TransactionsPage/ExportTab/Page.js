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
    expanded,
    expandFields
  }) => (
    <Aux>
      <div className="tabbed-page-subtitle export"><T id="export.subtitle" m="Export Transactions"/></div>
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
          <div className="export-area-button-wrapper">
            <KeyBlueButton onClick={exportCSV} disabled={exportingData || !destinationFile} loading={exportingData}>
              <T id="export.btnExport" m="Export" />
            </KeyBlueButton>
          </div>
        </div>
        <div  className={[ "export-area-right",!expanded && "export-info-not-expanded " ].join(" ")} onClick={expandFields}>
          <div className={expanded ? "vertical-expand expanded" : "vertical-expand"}/>
          <p className="export-info-description">{selectedExport.description}</p>
          <T id="export.infoFieldsHeader" m="Exported Fields" />:&nbsp;
          {expanded ?
            <ul className="export-info-fields">
              {selectedExport.fields.map(p => <FieldDescription key={p.name} {...p} />)}
            </ul> :
            <div className="export-info-not-expanded">
              {
                selectedExport.fields.map((p, i) => i == selectedExport.fields.length - 1 ? <span key={p.name}>{p.name}.</span> : <span key={p.name}>{p.name}, </span>)
              }
            </div>
          }
        </div>
      </div>
    </Aux>
  );

export default ExportPage;
