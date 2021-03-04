const electron = require("electron");
const dialog = electron.remote.dialog;

import PathInput from "../PathInput/PathInput";
import style from "./PathBrowseInput.module.css";
import { PathButton } from "buttons";
import { defineMessages, injectIntl } from "react-intl";

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

const PathBrowseInput = ({
  intl,
  filters,
  save,
  type,
  onChange,
  required,
  value,
  placeholder,
  showErrors,
  ...props
}) => {
  const selectDirectory = () => {
    const fileBrowserFilters = (filters || []).map((f) => {
      return { ...f, name: intl.formatMessage(FileBrowserFilterNames[f.key]) };
    });

    const f = save ? dialog.showSaveDialog : dialog.showOpenDialog;
    const opts = {
      properties: [type === "directory" ? "openDirectory" : "openFile"],
      filters: fileBrowserFilters
    };
    const cb = directorySelectorCallback;
    f(opts, directorySelectorCallback).then(cb);
  };

  const directorySelectorCallback = ({ filePaths, filePath }) => {
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
    <div className={style.pathInputAndButton}>
      <div className={style.pathInputArea}>
        <PathInput
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          showErrors={showErrors}
          {...props}
        />
      </div>
      <PathButton onClick={selectDirectory} />
    </div>
  );
};

export default injectIntl(PathBrowseInput);
