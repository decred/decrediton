import { fade } from "material-ui/utils/colorManipulator";
import * as Colors from "material-ui/styles/colors";
import { spacing, getMuiTheme } from "material-ui/styles";

const rawBaseTheme = {
  ...spacing,
  palette: {
    // Primary Blue
    primary1Color: "#2971ff",
    // Primary Green/Teal
    primary2Color: "#2ed8a3",
    // Primary DarkBlue
    primary3Color: "#132f4b",
    // Accent Light Blue
    accent1Color: "#69d5f7",
    // Accent Green
    accent2Color: "#41bf53",
    // Accent Orange
    accent3Color: "#fd714a",
    // Using default dark blue for text
    textColor: "#132f4b",
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: fade("#132f4b", 0.3)
  }
};

//Theme must be wrapped in funciton getMuiTheme
export default getMuiTheme(rawBaseTheme);
