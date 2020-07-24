
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePrevious, useMountEffect } from "hooks";
import * as sel from "selectors";
import * as spa from "../../../../../actions/VSPActions";
import { compose, eq, get } from "fp";

export function useLegacyPurchasePage(toggleShowVsp) {
  const stakePoolProps = useSelector(sel.selectedStakePool);
  const configuredStakePools = useSelector(sel.configuredStakePools);
  const unconfiguredStakePools = useSelector(sel.unconfiguredStakePools);
  const rescanRequest = useSelector(sel.rescanRequest);
  const stakePoolListingEnabled = useSelector(sel.stakePoolListingEnabled);
  const updatedStakePoolList = useSelector(sel.updatedStakePoolList);
  const isSavingStakePoolConfig = useSelector(sel.isSavingStakePoolConfig);
  const isImportingScript = useSelector(sel.isImportingScript);

  const dispatch = useDispatch();

  const onSetStakePoolInfo = useCallback((
    privpass,
    poolHost,
    apiKey,
    rescan) => dispatch(spa.setStakePoolInformation(
      privpass,
      poolHost,
      apiKey,
      rescan
    )), [dispatch]);

  const onRemoveStakePool = useCallback((host) => dispatch(spa.removeStakePoolConfig(host)), [dispatch]);
  const discoverAvailableStakepools = useCallback(() => dispatch(spa.discoverAvailableStakepools()), [dispatch]);

  const [isAdding, setIsAdding] = useState(false);
  const [show, setShow] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);
  const [selectedUnconfigured, setSelectedUnconfigured] = useState(unconfiguredStakePools[0]);

  const onShowAddStakePool = useCallback(() => {
    setIsAdding(true);
  }, []);

  const getIsAdding = useMemo(() => {
    return (
      isAdding ||
      configuredStakePools.length <= 0 ||
      isImportingScript
    );
  }, [isAdding, configuredStakePools.length, isImportingScript]);

  const getNoAvailableStakepools = useMemo(() => {
    return (
      unconfiguredStakePools.length === 0 &&
      configuredStakePools.length === 0
    );
  }, [unconfiguredStakePools.length, configuredStakePools.length]);

  const getSelectedUnconfigured = useMemo(() => {
    return selectedUnconfigured
      ? unconfiguredStakePools.find(
        compose(eq(selectedUnconfigured.Host), get("Host"))
      )
      : null;
  }, [selectedUnconfigured, unconfiguredStakePools]);

  const onChangeSelectedUnconfigured = useCallback((selectedUnconfigured) => {
    setSelectedUnconfigured(selectedUnconfigured);
  }, []);

  const onChangeApiKey = useCallback((apiKey) => {
    if (apiKey == "") {
      setHasFailedAttempt(true);
    }
    setApiKey(apiKey);
  }, []);

  const onCancelAddStakePool = useCallback(() => {
    setIsAdding(false);
    toggleShowVsp && toggleShowVsp(false);
  }, [toggleShowVsp]);

  const onSetStakePoolInfoCallback = useCallback((privpass) => {
    const onSetInfo = onSetStakePoolInfo;
    if (!onSetInfo) return;
    if (!apiKey) {
      setHasFailedAttempt(true);
      return;
    }
    onSetInfo(privpass, getSelectedUnconfigured.Host, apiKey, true);
  }, [apiKey, onSetStakePoolInfo, setHasFailedAttempt, getSelectedUnconfigured]);

  const onRemoveStakePoolCallback = useCallback((host) => {
    onRemoveStakePool && onRemoveStakePool(host);
  }, [onRemoveStakePool]);

  const getStakepoolListingEnabled = useCallback(() => {
    return stakePoolListingEnabled;
  }, [stakePoolListingEnabled]);

  const previousConfiguredStakePools = usePrevious(configuredStakePools);
  const previousStakePoolProps = usePrevious(stakePoolProps);

  useEffect(() => {
    if (configuredStakePools && previousConfiguredStakePools &&
      configuredStakePools.length >
      previousConfiguredStakePools.length
    ) {
      if (stakePoolProps !== previousStakePoolProps) {
        setShow(true);
        setIsAdding(false);
      }
    }
    const configuredHost = selectedUnconfigured
      ? selectedUnconfigured.Host
      : "";
    const hasUnconfigured = unconfiguredStakePools.some(
      (p) => p.Host === configuredHost
    );
    if (!hasUnconfigured && unconfiguredStakePools.length) {
      // We just added a stakepool, so it has been removed from the list of
      // unconfigured. Select the next one on the list.
      setSelectedUnconfigured(unconfiguredStakePools[0]);
      setApiKey("");
      setHasFailedAttempt(false);
    }
  }, [
    configuredStakePools,
    previousConfiguredStakePools,
    stakePoolProps,
    previousStakePoolProps,
    selectedUnconfigured,
    unconfiguredStakePools,
    getNoAvailableStakepools,
    getIsAdding
  ]);

  useMountEffect(() => {
    if (!selectedUnconfigured) {
      setSelectedUnconfigured(unconfiguredStakePools[0]);
    }
    if (
      !getStakepoolListingEnabled() &&
      stakePoolListingEnabled
    ) {
      discoverAvailableStakepools();
    }
    if (!updatedStakePoolList && getStakepoolListingEnabled()) {
      discoverAvailableStakepools();
    }
  });

  const toggleBackupModal = useCallback(() => {
    setShow(!show);
  }, [show]);

  return {
    onShowAddStakePool,
    toggleBackupModal,
    getNoAvailableStakepools,
    getStakepoolListingEnabled,
    getIsAdding,
    showModal: show,
    onRemoveStakePool: onRemoveStakePoolCallback,
    configuredStakePools,
    rescanRequest,
    selectedUnconfigured: getSelectedUnconfigured,
    unconfiguredStakePools,
    apiKey,
    isSavingStakePoolConfig,
    onChangeSelectedUnconfigured,
    onChangeApiKey,
    onSetStakePoolInfo: onSetStakePoolInfoCallback,
    onCancelAddStakePool,
    hasFailedAttempt
  };

}


