import { useState } from "react";
import ReleaseNotesForm from "./Form";

// versions with release notes available. From newer to older.
const availableVersions = [
  {
    version: "2.1.1",
    docName: "ReleaseNote2_1_1",
    imgClassName: "v211"
  },
  {
    version: "1.8.0",
    docName: "ReleaseNote1_8_0",
    imgClassName: "v180"
  },
  {
    version: "1.7.0",
    docName: "ReleaseNote1_7_0",
    imgClassName: "v170"
  },
  {
    version: "1.6.0",
    docName: "ReleaseNote1_6_0",
    imgClassName: "v160"
  },
  {
    version: "1.5.0",
    docName: "ReleaseNote1_5_0",
    imgClassName: "v150"
  },
  {
    version: "1.4.0",
    docName: "ReleaseNote1_4_0",
    imgClassName: "v140"
  },
  {
    version: "1.3.1",
    docName: "ReleaseNote1_3_1",
    imgClassName: "v130"
  },
  {
    version: "1.3.0",
    docName: "ReleaseNote1_3_0",
    imgClassName: "v130"
  }
];

const ReleaseNotes = ({ ...props }) => {
  const defaultVersionInfo = availableVersions[0];
  const [versionInfo, setVersionInfo] = useState(defaultVersionInfo);
  const [index, setIndex] = useState(0);

  const showVersion = (idx) => {
    if (idx < 0) idx = 0;
    if (idx >= availableVersions.length) idx = availableVersions.length - 1;
    if (idx !== index) {
      const versionInfo = availableVersions[idx];
      setVersionInfo(versionInfo);
      setIndex(idx);
    }
  };

  const onNewerVersion = () => {
    showVersion(index - 1);
  };

  const onOlderVersion = () => {
    showVersion(index + 1);
  };

  return (
    <ReleaseNotesForm
      {...{
        ...props,
        onNewerVersion,
        onOlderVersion,
        version: versionInfo.version,
        imgClassName: versionInfo.imgClassName,
        docName: versionInfo.docName,
        index
      }}
    />
  );
};

export default ReleaseNotes;
