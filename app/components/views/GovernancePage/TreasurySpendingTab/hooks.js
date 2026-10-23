import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as cla from "actions/ClientActions";
import { FormattedMessage as T } from "react-intl";

export function useTreasurySpending() {
  const treasuryPolicies = useSelector(sel.treasuryPolicies);
  const chainParams = useSelector(sel.chainParams);
  const PiKeys = chainParams.PiKeys;
  const setTreasuryPolicyRequestAttempt = useSelector(
    sel.setTreasuryPolicyRequestAttempt
  );
  const isTestNet = useSelector(sel.isTestNet);
  const dcrdSourceLink = isTestNet
    ? "https://github.com/decred/dcrd/blob/master/chaincfg/testnetparams.go#L391"
    : "https://github.com/decred/dcrd/blob/master/chaincfg/mainnetparams.go#L479";
  const tspendPolicies = useSelector(sel.tspendPolicies);
  const setTSpendPolicyRequestAttempt = useSelector(
    sel.setTSpendPolicyRequestAttempt
  );
  const txURLBuilder = useSelector(sel.txURLBuilder);
  const dispatch = useDispatch();

  const setTreasuryPolicy = (key, policy, passphrase) =>
    dispatch(cla.setTreasuryPolicy(key, policy, passphrase));
  const setTspendPolicy = (hash, policy, passphrase) =>
    dispatch(cla.setTSpendPolicy(hash, policy, passphrase));

  const policyOptions = [
    {
      label: <T id="treasurySpending.policyOptions.yes" m="yes" />,
      value: "yes"
    },
    {
      label: <T id="treasurySpending.policyOptions.no" m="no" />,
      value: "no"
    },
    {
      label: <T id="treasurySpending.policyOptions.abstain" m="abstain" />,
      value: "abstain"
    }
  ];

  return {
    treasuryPolicies,
    setTreasuryPolicy,
    setTreasuryPolicyRequestAttempt,
    tspendPolicies,
    setTspendPolicy,
    setTSpendPolicyRequestAttempt,
    policyOptions,
    dcrdSourceLink,
    PiKeys,
    txURLBuilder
  };
}
