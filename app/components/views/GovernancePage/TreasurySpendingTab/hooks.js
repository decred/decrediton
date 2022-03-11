import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as cla from "actions/ClientActions";
import { FormattedMessage as T } from "react-intl";

export function useTreasurySpending() {
  const treasuryPolicies = useSelector(sel.treasuryPolicies);
  const setTreasuryPolicyRequestAttempt = useSelector(
    sel.setTreasuryPolicyRequestAttempt
  );
  const dispatch = useDispatch();

  const setTreasuryPolicy = (key, policy, passphrase) =>
    dispatch(cla.setTreasuryPolicy(key, policy, passphrase));

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
    policyOptions,
    isLoading: !!setTreasuryPolicyRequestAttempt
  };
}
