const electron = require("electron");
const dialog = electron.remote.dialog;

import PathInput from "./PathInput";
import { PathButton } from "../buttons";
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

@autobind
class PathBrowseInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { path: "" };
  }

  selectDirectory() {
    const intl = this.props.intl;
    const filters = (this.props.filters || []).map((f) => {
      return { ...f, name: intl.formatMessage(FileBrowserFilterNames[f.key]) };
    });

    const f = this.props.save ? dialog.showSaveDialog : dialog.showOpenDialog;
    const opts = {
      properties: [
        this.props.type === "directory" ? "openDirectory" : "openFile"
      ],
      filters: filters
    };
    const cb = this.directorySelectorCallback;
    f(opts, this.directorySelectorCallback).then(cb);
  }

  directorySelectorCallback({ filePaths, filePath }) {
    let path;

    if (filePaths && filePaths.length > 0) {
      path = filePaths[0];
    } else if (filePath) {
      path = filePath;
    } else {
      return;
    }

    this.setState({ path });
    this.props.onChange(path);
  }

  onChange(path) {
    this.props.onChange(path);
    this.setState({ path });
  }

  render() {
    return (
      <div className={"path-input-and-button"}>
        <div className="path-input-area">
          <PathInput
            required={this.props.required}
            value={this.props.value}
            onChange={this.onChange}
            placeholder={this.props.placeholder}
            showErrors={this.props.showErrors}
          />
        </div>
        <PathButton onClick={this.selectDirectory} />
      </div>
    );
  }
}

export default injectIntl(PathBrowseInput);
