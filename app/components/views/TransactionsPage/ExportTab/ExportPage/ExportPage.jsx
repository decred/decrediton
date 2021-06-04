import Select from "react-select";
import { FormattedMessage as T, defineMessages } from "react-intl";
import { classNames } from "pi-ui";
import { KeyBlueButton, InfoModalButton } from "buttons";
import { PathBrowseInput, FileBrowserFilters } from "inputs";
import { Subtitle } from "shared";
import styles from "./ExportPage.module.css";

const FieldDescription = ({ name, description }) => (
  <li>
    <span className={styles.exportInfoFieldName}>{name.trim()}:</span>
    {description}
  </li>
);

const messages = defineMessages({
  destinationPlaceholder: {
    id: "export.destination.placeholder",
    defaultMessage: "Choose destination..."
  }
});

const ExportPage = ({
  exportingData,
  availableExports,
  selectedExport,
  destinationFile,
  setDestinationFile,
  onExportCSV,
  onChangeSelectedExport,
  intl
}) => (
  <>
    <Subtitle
      title={<T id="export.subtitle" m="Export Transactions" />}
      className={classNames(styles.isRow)}
      children={
        <div className={classNames(styles.contentTitleButtonsArea)}>
          <InfoModalButton
            modalContent={
              <div className={styles.modalContent}>
                <div className={styles.exportInfoDescription}>
                  {selectedExport.description}
                </div>
                <T id="export.infoFieldsHeader" m="Exported Fields" />:
                <ul className={styles.exportInfoFields}>
                  {selectedExport.fields.map((p) => (
                    <FieldDescription key={p.name} {...p} />
                  ))}
                </ul>
              </div>
            }
            modalTitle={
              <div className={styles.modalTitle}>
                <T id="export.modalTitle" m="Export Transactions" />
              </div>
            }
            modalClassName={styles.modal}
            draggable
          />
        </div>
      }
    />
    <div className={styles.exportArea}>
      {
        // `selectWithBigFont` className is
        // temp solution to skinning from ReactSelectGlobal.css.
        // When react-select will be replaced by the `pi-ui` component,
        // this className can be deleted.
      }
      <div className={classNames(styles.exportAreaLeft, "selectWithBigFont")}>
        <label>
          <T id="export.select" m="Export Type" />
          <Select
            clearable={false}
            multi={false}
            valueKey="key"
            labelKey="name"
            value={selectedExport.key}
            options={availableExports}
            onChange={onChangeSelectedExport}
          />
        </label>

        <label>
          <T id="export.destination" m="Destination" />
          <PathBrowseInput
            save
            type="file"
            className={styles.pathBrowseInput}
            placeholder={intl.formatMessage(messages.destinationPlaceholder)}
            value={destinationFile}
            filters={[FileBrowserFilters.csv, FileBrowserFilters.all]}
            onChange={(value) => setDestinationFile(value)}
          />
        </label>
      </div>
      <div className={classNames(styles.exportAreaRight)}>
        <p
          className={styles.exportInfoDescription}
          data-testid="export-description">
          {selectedExport.description}
        </p>
        <div>
          <T id="export.infoFieldsHeader" m="Exported Fields" />
          :&nbsp;
          <span
            className={styles.exportInfoNotExpanded}
            data-testid="exported-fields">
            {selectedExport.fields
              .map(({ name }) => name.charAt(0).toUpperCase() + name.slice(1))
              .join(", ")}
            .
          </span>
        </div>
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
