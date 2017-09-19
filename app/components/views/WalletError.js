import React from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import walletErrorConnector from "../../connectors/walletError";

const styles = {
  body: {
    position: "fixed",
    left: "0px",
    top: "50%",
    right: "0px",
    display: "block",
    overflow: "hidden",
    width: "1178px",
    height: "770px",
    marginTop: "-385px",
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: "#FFF",
  },
  view: {
    width: "880px",
    height: "100%",
    float: "right",
    backgroundColor: "#f3f6f6",
  },
  content: {
    overflow: "auto",
    height: "556px",
    padding: "54px 60px 54px 80px",
  },
};

const WalletError = ({ getNetworkError }) => (
  <div style={styles.body}>
    <SideBar errorPage />
    <div style={styles.view}>
      <Header headerTitleOverview="An error has occured" />
      <div style={styles.content}>
        {getNetworkError !== null ?
          <p>{getNetworkError} Please verify that your dcrd is configured correctly and restart.</p> :
          <p> We have detected that your wallet has disconnected.
            Please reload Decrediton to fix this problem. </p>
        }
      </div>
    </div>
  </div>
);

export default walletErrorConnector(WalletError);
