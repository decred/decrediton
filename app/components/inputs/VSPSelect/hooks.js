import { useDispatch, useSelector } from "react-redux";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import * as vspa from "actions/VSPActions";
import * as sel from "selectors";
import { useState, useMemo } from "react";

export const useVSPSelect = (options, vsp, setVspFee) => {
  const dispatch = useDispatch();
  const availableVSPs = useSelector(sel.getAvailableVSPs);
  const getVSPInfo = (host) => dispatch(vspa.getVSPInfo(host));
  const [selectedOption, setSelected] = useState(null);
  const [pubkey, setPubkey] = useState(null);
  const [host, setHost] = useState(null);
  const vspInfo = useMemo(
    () => ({
      pubkey,
      host
    }),
    [pubkey, host]
  );
  const onSetVspInfo = ({ pubkey, host }) => {
    setPubkey(pubkey);
    setHost(host);
  };

  const [state, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        // set vsp if it is already selected. This can happen if the auto buyer
        // is already running.
        if (vsp && vsp.host) {
          const { host, pubkey } = vsp;
          // we add label to the selected option, as the vsp is already
          // selected.
          setSelected({ host, label: host });

          if (pubkey) {
            onSetVspInfo({ pubkey, host });
          } else {
            // Fetch the missing fetch pubkey.
            // Probably the host has read from the config
            send({ type: "FETCH", value: { host, label: host } });
          }
        }
        if (!options) send({ type: "REJECT", error: "Options not defined." });
      },
      load: (c, event) => {
        const { value } = event;
        setSelected(value);
        getVSPInfo(value.host)
          .then((info) => {
            const { pubkey, error } = info;
            if (error) {
              return send({ type: "REJECT", error });
            }
            onSetVspInfo({ pubkey, host: value.host });
            if (setVspFee && info.feepercentage) {
              setVspFee(info.feepercentage);
            }
            send("RESOLVE");
          })
          .catch((error) => send({ type: "REJECT", error }));
      }
    }
  });

  return {
    send,
    state,
    selectedOption,
    vspInfo,
    availableVSPs
  };
};
