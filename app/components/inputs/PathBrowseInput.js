const electron = require("electron");
const dialog = electron.remote.dialog;
const mainWindow = electron.remote.getCurrentWindow();
const ipc = electron.ipcRenderer;

import PathInput from "./PathInput";
import { PathButton } from "../buttons";
import { isArray } from "util";
import { defineMessages, injectIntl } from "react-intl";

// Import this and pass one of the objects as a member of the filter prop
// of PathBrowseInput
export const FileBrowserFilters = {
  csv: { key: "csv", extensions: [ "csv" ] },
  all: { key: "all", extensions: [ "*" ] }
};

const FileBrowserFilterNames = defineMessages({
  csv: { id: "fileBrowserTypes.csv.name", defaultMessage: "CSV Files" },
  all: { id: "fileBrowserTypes.all.name", defaultMessage: "All Files" },
});

@autobind
class PathBrowseInput extends React.Component {

  key = Math.random().toString(36).substring(2, 15);

  constructor(props) {
    super(props);
    this.state = { path: "" };
  }

  componentDidMount() {

    let self = this;
    let pathListener = function (event, data) {
      let path = isArray(data) ? data[0] : data;
      self.setState({ path });
      self.props.onChange(path);
    };

    ipc.on(this.key, pathListener);
  }

  componentWillUnmount() {
    ipc.removeAllListeners(this.key);
  }

  selectDirectory() {
    const intl = this.props.intl;
    const filters = (this.props.filters || []).map(f => {
      return { ...f, name: intl.formatMessage(FileBrowserFilterNames[f.key]) };
    });

    const f = this.props.save ? dialog.showSaveDialog : dialog.showOpenDialog;
    const opts = {
      properties: [ this.props.type === "directory" ? "openDirectory" : "openFile" ],
      filters: filters,
    };
    f(mainWindow, opts, this.directorySelectorCallback);
  }

  directorySelectorCallback(filenames) {
    if (filenames && filenames.length > 0) {
      mainWindow.webContents.send(this.key, filenames);
    }
  }

  onChange(path) {
    this.props.onChange(path);
    this.setState({ path });
  }

  render() {
    return (
      <div className={"path-input-and-button"}>
        <PathInput
          value={this.props.value}
          onChange={this.onChange}
          placeholder={this.props.placeholder}
        />
        <PathButton onClick={this.selectDirectory} />
      </div>
    );
  }
}

export default injectIntl(PathBrowseInput);
