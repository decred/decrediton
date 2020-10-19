import { FormattedMessage as T } from "react-intl";
import { Subtitle, Balance } from "shared";
import { CopyableText } from "pi-ui";
import styles from "./NetworkTab.module.css";

const Hop = ({ hop, index }) => (
  <>
    <span>{index}</span>
    <span>{hop.fee}</span>
    <span><CopyableText id="copyable" className={styles.copyableText}>{hop.pubKey}</CopyableText></span>
  </>
);

const Route = ({ route, routeIndex }) => (
  <div className={styles.route}>
    <span><T id="ln.routesInfo.routeAmount" m="Total amount" /></span>
    <div className={styles.infoContent}><Balance amount={route.totalAmt} /></div>
    <span><T id="ln.routesInfo.routeFees" m="Total fees" /></span>
    <div className={styles.infoContent}><Balance amount={route.totalFees} /></div>
    <div className={styles.hopsGrid}>
      <span><T id="ln.routesInfo.hop" m="Hop" /></span>
      <span><T id="ln.routesInfo.hopFee" m="Fee" /></span>
      <span><T id="ln.routesInfo.hopPubkey" m="Public Key" /></span>
      {route.hopsList.map((hop, i) => (
        <Hop key={`hop-${routeIndex}-${i}`} hop={hop} index={i} />
      ))}
    </div>
  </div>
);

const RoutesInfo = ({
  nodeID,
  amount,
  routes
}) => {
  return(
    <>
    <div className={styles.basicInfo}>
      <span><T id="ln.routesInfo.pubkey" m="Public Key" /></span>
      <div className={styles.basicInfoContent}>{nodeID}</div>
      <span><T id="ln.routesInfo.amount" m="Amount" /></span>
      <div className={styles.basicInfoContent}><Balance amount={amount} /></div>
      <span><T id="ln.routesInfo.probability" m="Probability of success" /></span>
      <div className={styles.basicInfoContent}>{routes.successProb}</div>
    </div>

    <Subtitle title={
      <T id="ln.routesInfo.routesList" m="Routes"/>
      } />
     <div className={styles.channelList}>
       { routes.routesList.map((r, i) =>
       <Route
         key={`route-${i}`}
         route={r}
         routeIndex={i}
       />)}
     </div>
    </>
  );
};

export default RoutesInfo;
