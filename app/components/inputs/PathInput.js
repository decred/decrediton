const electron = require("electron");
const dialog = electron.remote.dialog;
const mainWindow = electron.remote.getCurrentWindow();
const ipc = electron.ipcRenderer;

import { PathButton } from "../buttons";

class PathInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { path: "" };
    this.selectDirectory = this.selectDirectory.bind(this);
  }

  componentDidMount() {
    const self = this;
    ipc.on("path", function (event, data) {
      self.setState({ path: data });
      self.props.onChange(data);
    });
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
      <div>
        <input
          type="text"
          className="path-input"
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


export default PathInput;
