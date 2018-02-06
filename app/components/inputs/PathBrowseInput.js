const electron = require("electron");
const dialog = electron.remote.dialog;
const mainWindow = electron.remote.getCurrentWindow();
const ipc = electron.ipcRenderer;

import PathInput from "./PathInput";
import { PathButton } from "../buttons";

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
      self.setState({ path: data });
      self.props.onChange(data);
    };

    ipc.on(this.key, pathListener);
  }

  componentWillUnmount() {
    ipc.removeAllListeners(this.key);
  }

  selectDirectory() {
    dialog.showOpenDialog(mainWindow, {
      properties: [this.props.type === "directory" ? "openDirectory" : "openFile"]
    }, this.directorySelectorCallback);
  }

  directorySelectorCallback(filenames) {
    if (filenames && filenames.length > 0) {
      mainWindow.webContents.send(this.key, filenames[0]);
    }
  }

  onChange(e) {
    this.props.onChange(e.target.value);
    this.setState({ path: e.target.value });
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


export default PathBrowseInput;
