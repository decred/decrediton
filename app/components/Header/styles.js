import WalletGray from "../icons/wallet-gray.svg";
import TicketSmall from "../icons/tickets-ticket.svg";
import PlusBig from "../icons/plus-big.svg";
import MinusBig from "../icons/minus-big.svg";

const styles = {
  headerGetStarted: {
    paddingRight: "42px",
    paddingLeft: "80px",
    backgroundColor: "#596d81",
  },
  headerTopGetStarted: {
    height: "34px",
    paddingTop: "5px",
    textAlign: "center",
  },
  headerTitleOverviewGetStarted: {
    height: "54px",
    paddingTop: "13px",
    color: "#fff",
    fontSize: "27px",
  },
  headerMetaOverviewGetStarted: {
    height: "54px",
    paddingTop: "5px",
    fontSize: "13px",
    color: "#c4cbd2",
    fontFamily: "Inconsolata, monospace",
  },
  header: {
    paddingRight: "42px",
    paddingLeft: "80px",
    backgroundColor: "#fff",
  },
  headerTop: {
    height: "34px",
    paddingTop: "5px",
    textAlign: "center",
  },
  headerTitleOverview: {
    height: "54px",
    paddingTop: "13px",
    color: "#596d81",
    fontSize: "27px",
  },
  headerMetaOverview: {
    height: "54px",
    paddingTop: "5px",
    fontSize: "53px",
  },
  Snackbar: {
    fontFamily: "inherit",
    position: "absolute",
    left: "61%",
  },
  SnackbarContentSend: {
    height: "78px",
    padding: "0px 50px",
    backgroundColor: "rgba(12, 30, 62, 0.5)",
    backgroundImage: `url(${MinusBig})`,
    backgroundPosition: "15px 50%",
    backgroundSize: "20px",
    backgroundRepeat: "no-repeat",
  },
  SnackbarContentReceive: {
    height: "78px",
    padding: "0px 50px",
    backgroundColor: "rgba(12, 30, 62, 0.5)",
    backgroundImage: `url(${PlusBig})`,
    backgroundPosition: "15px 50%",
    backgroundSize: "20px",
    backgroundRepeat: "no-repeat",
  },
  SnackbarContentStake: {
    height: "78px",
    padding: "0px 50px",
    backgroundColor: "rgba(12, 30, 62, 0.5)",
    backgroundImage: `url(${TicketSmall})`,
    backgroundPosition: "15px 50%",
    backgroundSize: "20px",
    backgroundRepeat: "no-repeat",
  },
  SnackbarContentTransfer: {
    height: "78px",
    padding: "0px 50px",
    backgroundColor: "rgba(12, 30, 62, 0.5)",
    backgroundImage: `url(${WalletGray})`,
    backgroundPosition: "15px 50%",
    backgroundSize: "20px",
    backgroundRepeat: "no-repeat",
  },
  SnackbarInformation: {
    fontFamily: "Source Sans Pro, sans-serif",
    width: "100%",
  },
  SnackbarInformationRow: {
    width: "100%",
    float: "left",
    height: "25px",
  },
  SnackbarInformationRowType: {
    width: "30%",
    float: "left",
  },
  SnackbarInformationRowAmount: {
    width: "40%",
    float: "left",
  },
  SnackbarInformationRowFee: {
    width: "30%",
    float: "left",
    textAlign: "right",
  },
  SnackbarInformationRowTx: {
    width: "100%",
    float: "left",
    textAlign: "center",
    fontFamily: "Inconsolata, monospace",
  }
};

export default styles;
