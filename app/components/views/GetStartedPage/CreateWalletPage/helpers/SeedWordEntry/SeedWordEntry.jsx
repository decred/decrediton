import Select from "react-select";
import { SEED_WORDS } from "wallet/seed";
import * as wallet from "wallet";
import { useLayoutEffect } from "react";
// SeedWordSelect.css includes custom styling for seed word select which need
// to be loaded *after* ReactSelectGlobal.less, both imports should be deleted
// when migrating to pi-ui's Select componentt!
import "./SeedWordSelect.css";

const SEED_WORD_OPTIONS = SEED_WORDS.map((name) => ({ name }));

const SeedWordEntry = ({
  className,
  onPasteFromClipboard,
  onChange,
  seedWord,
  onPaste,
  value: { name },
  disabled
}) => {
  useLayoutEffect(() => {
    document.onmousedown = (e) => {
      if (e.which === 2) {
        e.preventDefault();

        const isPasted = onPasteFromClipboard(wallet.readFromClipboard());

        // missing with the select options from react-select
        if (isPasted) {
          const select = document.querySelector(".Select-menu-outer");
          if (select) {
            select.style.display = "none";
          }
        }
      }
    };
  });

  const getSeedWords = (input, callback) => {
    input = input.toLowerCase();
    const options = SEED_WORD_OPTIONS.filter(
      (i) => i.name.toLowerCase().substr(0, input.length) === input
    );
    callback(null, {
      options: options.slice(0, 5)
    });
  };

  const selectKeyDown = (e) => {
    switch (e.keyCode) {
      case 32:
        e.keyCode = 9;
        break;
    }
  };

  const value = { name };
  return (
    <div className={className} onPaste={onPaste}>
      <Select.Async // use pi-ui's select here
        autoFocus
        simpleValue
        disabled={disabled}
        clearable={false}
        multi={false}
        filterOptions={false}
        value={value}
        onChange={(value) => onChange(seedWord, value)}
        valueKey="name"
        labelKey="name"
        loadOptions={getSeedWords}
        onInputKeyDown={selectKeyDown}
      />
    </div>
  );
};

export default SeedWordEntry;
