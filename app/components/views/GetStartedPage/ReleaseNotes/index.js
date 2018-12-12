import ReleaseNotesForm from "./Form";

// versions with release notes available. From newer to older.
const availableVersions = [
  { version: "1.4.0", docName: "ReleaseNote1_4_0", imgClassName: "release-image-v140" },
  { version: "1.3.1", docName: "ReleaseNote1_3_1", imgClassName: "release-image-v130" },
  { version: "1.3.0", docName: "ReleaseNote1_3_0", imgClassName: "release-image-v130" }
];

@autobind
class ReleaseNotes extends React.Component {

  constructor(props) {
    super(props);

    const versionInfo = availableVersions[0];
    this.state = { ...versionInfo, index: 0 };
  }

  showVersion(index) {
    if (index < 0) index = 0;
    if (index >= availableVersions.length) index = availableVersions.length-1;
    if (index !== this.state.index) {
      const versionInfo = availableVersions[index];
      this.setState({ ...versionInfo, index });
    }
  }

  onNewerVersion() { this.showVersion(this.state.index-1); }
  onOlderVersion() { this.showVersion(this.state.index+1); }

  render() {
    const { onNewerVersion, onOlderVersion } = this;

    return (
      <ReleaseNotesForm
        {...this.props}
        {...this.state}
        onNewerVersion={onNewerVersion}
        onOlderVersion={onOlderVersion}
      />
    );
  }
}

export default ReleaseNotes;
