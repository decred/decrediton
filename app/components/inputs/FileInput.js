const electron = require('electron')
const dialog = electron.remote.dialog
const mainWindow = electron.remote.getCurrentWindow()
const ipc = electron.ipcRenderer;

import { DirectoryButton } from "../buttons";
import TextInput from "./TextInput";
import { FormattedMessage as T } from "react-intl";

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { directory: "" };

    // This binding is necessary to make `this` work in the callback
    this.selectDirectory = this.selectDirectory.bind(this);
  }

  componentDidMount() { // When the document is rendered
    const self = this;
    ipc.on('directory', function (event, data) { // When the message is received...
      console.log('Message received: ' + data);
      self.setState({ directory: data }); // ... change the state of this React component
      self.props.onChange(data);
    });
  }

  selectDirectory() {
    dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    }, this.directorySelectorCallback)
  }

  directorySelectorCallback(filenames) {
    if (filenames && filenames.length > 0) {
      mainWindow.webContents.send('directory', filenames[0]);
    }
  }

  render() {

    return (
      <div>
        <input
          type="text"
          className="directory-input"
          value={this.props.value}
          onChange={(e) => {
            this.props.onChange(e.target.value);
            this.setState({ directory: e.target.value });
          }}
          placeholder={this.props.placeholder}
        />
        <DirectoryButton onClick={this.selectDirectory} />
      </div>
    );
  }
}


export default FileInput;
