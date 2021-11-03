import { useMountEffect } from "hooks";
import { useState, useCallback } from "react";

export const useInitPage = ({ onInitDex, onInitDexWithSeed }) => {
  const [hasSeed, setHasSeed] = useState(false);

  const [seed, setSeed] = useState("");

  const [seedError, setSeedError] = useState(null);

  const resetState = () => {
    setSeed("");
    setSeedError(null);
  };

  useMountEffect(() => {
    resetState();
  });

  const onInitDexCall = (passphrase) => {
    if (hasSeed) {
      if (seed == "") {
        setSeedError("You must enter a seed.");
      } else {
        onInitDexWithSeed(passphrase, seed);
      }
    } else {
      onInitDex(passphrase);
    }
  };

  const toggleHasSeed = useCallback(() => {
    setHasSeed(!hasSeed);
  }, [hasSeed]);

  return {
    hasSeed,
    toggleHasSeed,
    seed,
    setSeed,
    seedError,
    onInitDexCall
  };
};
