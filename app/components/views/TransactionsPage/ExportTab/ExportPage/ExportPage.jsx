import Select from "react-select";
import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import { KeyBlueButton } from "buttons";
import { InlineField, PathBrowseInput, FileBrowserFilters } from "inputs";
import { Subtitle } from "shared";
import styles from "./ExportPage.module.css";

const FieldDescription = ({ name, description }) => (
  <li>
    <span className={styles.exportInfoFieldName}>{name}:</span>
    {description}
  </li>
);

const ExportPage = ({
  exportingData,
  availableExports,
  selectedExport,
  expanded,
  expandFields,
  destinationFile,
  setDestinationFile,
  onExportCSV,
  onChangeSelectedExport
}) => (
  <>
    <Subtitle title={<T id="export.subtitle" m="Export Transactions" />} />
    <div className={styles.exportArea}>
      <div className={styles.exportAreaLeft}>
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
            filters={[FileBrowserFilters.csv, FileBrowserFilters.all]}
            onChange={(value) => setDestinationFile(value)}
          />
        </InlineField>
      </div>
      <div
        className={classNames(
          styles.exportAreaRight,
          !expanded && styles.exportInfoNotExpanded
        )}
        onClick={expandFields}>
        <div
          className={expanded ? 
            classNames(styles.verticalExpand, styles.expanded) : 
            styles.verticalExpand
          }
        />
        <p className={styles.exportInfoDescription}>{selectedExport.description}</p>
        <T id="export.infoFieldsHeader" m="Exported Fields" />
        :&nbsp;
        {expanded ? (
          <ul className={styles.exportInfoFields}>
            {selectedExport.fields.map((p) => (
              <FieldDescription key={p.name} {...p} />
            ))}
          </ul>
        ) : (
          <div className={styles.exportInfoNotExpanded}>
            {selectedExport.fields.map((p, i) =>
              i == selectedExport.fields.length - 1 ? (
                <span key={p.name}>{p.name}.</span>
              ) : (
                <span key={p.name}>{p.name}, </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
    <div className={styles.exportAreaButton}>
      <KeyBlueButton
        onClick={onExportCSV}
        disabled={exportingData || !destinationFile}
        loading={exportingData}>
        <T id="export.btnExport" m="Export" />
      </KeyBlueButton>
    </div>
  </>
);

export default ExportPage;
