import { walletError } from "connectors";

const styles = {
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
  <div style={styles.view}>
    <div style={styles.content}>
      { getNetworkError ?
        <p>{getNetworkError} Please verify that your dcrd is configured correctly and restart.</p> :
        <p> We have detected that your wallet has disconnected.
          Please reload Decrediton to fix this problem. </p>
      }
    </div>
  </div>
);

export default walletError(WalletError);
