const electron = require("electron");
const dialog = electron.remote.dialog;
const mainWindow = electron.remote.getCurrentWindow();
const ipc = electron.ipcRenderer;

import PathInput from "./PathInput";
import { PathButton } from "../buttons";

let pathListener;

@autobind
class PathBrowseInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = { path: "" };
  }

  componentDidMount() {

    let self = this;
    pathListener = function (event, data) {
      self.setState({ path: data });
      self.props.onChange(data);
    };

    ipc.on("path", pathListener);
  }

  componentWillUnmount() {
    ipc.removeListener("path", pathListener);
  }

  selectDirectory() {
    dialog.showOpenDialog(mainWindow, {
      properties: [this.props.type === "directory" ? "openDirectory" : "openFile"]
    }, this.directorySelectorCallback);
  }

  directorySelectorCallback(filenames) {
    if (filenames && filenames.length > 0) {
      mainWindow.webContents.send("path", filenames[0]);
    }
  }

  render() {
    return (
      <div className={"path-input-and-button"}>
        <PathInput
          value={this.props.value}
          onChange={(e) => {
            this.props.onChange(e.target.value);
            this.setState({ path: e.target.value });
          }}
          placeholder={this.props.placeholder}
        />
        <PathButton onClick={this.selectDirectory} />
      </div>
    );
  }
}


export default PathBrowseInput;
