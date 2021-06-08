import { wallet } from "wallet-preload-shim";
import style from "./PathBrowseInput.module.css";
import { PathButton } from "buttons";
import { defineMessages, injectIntl } from "react-intl";
import Input from "../Input";

// Import this and pass one of the objects as a member of the filter prop
// of PathBrowseInput
export const FileBrowserFilters = {
  csv: { key: "csv", extensions: ["csv"] },
  all: { key: "all", extensions: ["*"] }
};

const FileBrowserFilterNames = defineMessages({
  csv: { id: "fileBrowserTypes.csv.name", defaultMessage: "CSV Files" },
  all: { id: "fileBrowserTypes.all.name", defaultMessage: "All Files" }
});

const PathBrowseInput = ({ intl, filters, save, type, onChange, ...props }) => {
  const selectDirectory = async () => {
    const fileBrowserFilters = (filters || []).map((f) => {
      return { ...f, name: intl.formatMessage(FileBrowserFilterNames[f.key]) };
    });

    const dialogFunc = save ? wallet.showSaveDialog : wallet.showOpenDialog;
    const opts = {
      properties: [type === "directory" ? "openDirectory" : "openFile"],
      filters: fileBrowserFilters
    };

    const { filePaths, filePath } = await dialogFunc(opts);

    let path;
    if (filePaths && filePaths.length > 0) {
      path = filePaths[0];
    } else if (filePath) {
      path = filePath;
    } else {
      return;
    }

    onChange(path);
  };

  return (
    <Input
      type="text"
      onChange={(e) => onChange(e.target.value)}
      inputClassNames={style.textInput}
      {...props}>
      <PathButton onClick={selectDirectory} />
    </Input>
  );
};

export default injectIntl(PathBrowseInput);
