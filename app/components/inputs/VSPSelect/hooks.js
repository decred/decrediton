import { useDispatch } from "react-redux";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import * as vspa from "actions/VSPActions";
import { useState, useMemo } from "react";

export const useVSPSelect = (options) => {
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
        if (!options) send({ type: "REJECT", error: "Options not defined." });
      },
      load: (c, event) => {
        const { value } = event;
        getVSPInfo(value.host)
          .then((info) => {
            setSelected(value);
            const { pubkey } = info;
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
