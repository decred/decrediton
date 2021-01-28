import { useState } from "react";
import { AdvancedBody } from "./Form";
import {
  setAppdataPath,
  getAppdataPath,
  getRemoteCredentials,
  setRemoteCredentials
} from "config.js";

export const AdvancedStartupBody = ({
  submitRemoteCredentials,
  onStartDaemon,
  submitAppdata,
  ...props
}) => {
  const {
    rpc_pass: rpcpass,
    rpc_user: rpcuser,
    rpc_cert: rpccert,
    rpc_host: rpchost,
    rpc_port: rpcport
  } = getRemoteCredentials();

  const appDataPath = getAppdataPath();
  const [sideActive, setSideActive] = useState(true);
  const [rpc_user, setRpcUserState] = useState(rpcuser);
  const [rpc_pass, setRpcPassState] = useState(rpcpass);
  const [rpc_cert, setRpcCertState] = useState(rpccert);
  const [rpc_host, setRpcHostState] = useState(rpchost);
  const [rpc_port, setRpcPortState] = useState(rpcport);
  const [rpcUserHasFailedAttempt, setUserHasFailedAttempt] = useState(false);
  const [rpcPasswordHasFailedAttempt, setPasswordHasFailedAttempt] = useState(
    false
  );
  const [rpcHostHasFailedAttempt, setHostHasFailedAttempt] = useState(false);
  const [rpcPortHasFailedAttempt, setPortHasFailedAttempt] = useState(false);
  const [rpcCertHasFailedAttempt, setCertHasFailedAttempt] = useState(false);
  const [appDataHasFailedAttempt, setAppDataHasFailedAttempt] = useState(false);
  const [appdata, setAppDataState] = useState(appDataPath);

  const setRpcUser = (rpc_user) => {
    if (rpc_user == "") {
      setUserHasFailedAttempt(true);
    }
    setRpcUserState(rpc_user);
  };

  const setRpcPass = (rpc_pass) => {
    if (rpc_pass == "") {
      setPasswordHasFailedAttempt(true);
    }
    setRpcPassState(rpc_pass);
  };

  const setRpcHost = (rpc_host) => {
    if (rpc_host == "") {
      setHostHasFailedAttempt(true);
    }
    setRpcHostState(rpc_host);
  };

  const setRpcPort = (rpc_port) => {
    if (rpc_port == "") {
      setPortHasFailedAttempt(true);
    }
    setRpcPortState(rpc_port);
  };

  const setRpcCert = (rpc_cert) => {
    if (rpc_cert == "") {
      setCertHasFailedAttempt(true);
    }
    setRpcCertState(rpc_cert);
  };

  const setAppData = (appdata) => {
    if (appdata == "") {
      setAppDataHasFailedAttempt(true);
    }
    setAppDataState(appdata);
  };

  const isRemoteValid = () => {
    return !!(rpc_user && rpc_pass && rpc_cert && rpc_host && rpc_port);
  };

  const onSubmitRemoteForm = () => {
    setRemoteCredentials(rpc_user, rpc_pass, rpc_cert, rpc_host, rpc_port);
    submitRemoteCredentials({
      rpc_user,
      rpc_pass,
      rpc_cert,
      rpc_host,
      rpc_port
    });
  };

  const onSubmitAppDataForm = () => {
    setAppdataPath(appdata);
    submitAppdata(appdata);
  };

  const isAppDataValid = () => !!appdata;

  const skipAdvancedDaemon = () => {
    onStartDaemon();
  };

  const onShowRemote = () => {
    setSideActive(false);
  };

  const onShowAppData = () => {
    setSideActive(true);
  };

  const remoteValid = isRemoteValid();
  const appDataValid = isAppDataValid();
  return (
    <AdvancedBody
      {...{
        ...props,
        sideActive,
        rpc_user,
        rpc_pass,
        rpc_cert,
        rpc_host,
        rpc_port,
        rpcUserHasFailedAttempt,
        rpcPasswordHasFailedAttempt,
        rpcHostHasFailedAttempt,
        rpcPortHasFailedAttempt,
        rpcCertHasFailedAttempt,
        appDataHasFailedAttempt,
        appdata,
        onSubmitAppDataForm,
        onSubmitRemoteForm,
        skipAdvancedDaemon,
        onShowRemote,
        onShowAppData,
        setRpcUser,
        setRpcPass,
        setRpcCert,
        setRpcHost,
        setRpcPort,
        setAppData,
        remoteValid,
        appDataValid
      }}
    />
  );
};
