import { useDispatch } from "react-redux";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import * as vspa from "actions/VSPActions";
import { useState, useMemo } from "react";

export const useVSPSelect = (options, vsp) => {
  const dispatch = useDispatch();
  const getVSPInfo = (host) => dispatch(vspa.getVSPInfo(host));
  const [selectedOption, setSelected] = useState(null);
  const [pubkey, setPubkey] = useState(null);
  const [host, setHost] = useState(null);
  const vspInfo = useMemo(() => ({
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
        if (vsp) {
          const { host, pubkey } = vsp;
          // we add label to the selected option, as the vsp is already
          // selected.
          setSelected({ host, label: host });
          onSetVspInfo({ pubkey, host });
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
    vspInfo
  };
};
