import { Select } from "inputs";
import { SEED_WORDS } from "constants/seed";
import { wallet } from "wallet-preload-shim";
import { useLayoutEffect } from "react";

const SEED_WORD_OPTIONS = SEED_WORDS.map((name) => ({ name }));

const SeedWordEntry = ({
  className,
  onPasteFromClipboard,
  onChange,
  seedWord,
  onPaste,
  value: { name },
  disabled,
  autoFocus
}) => {
  useLayoutEffect(() => {
    document.onmousedown = (e) => {
      if (e.which === 2) {
        e.preventDefault();

        const isPasted = onPasteFromClipboard(wallet.readFromClipboard());

        // missing with the select options from react-select
        if (isPasted) {
          const select = document.querySelector("[id$='listbox']");
          if (select) {
            select.style.display = "none";
          }
        }
      }
    };
  });

  const getSeedWords = (input, callback) => {
    const inputValue = input.toLowerCase();
    const options = SEED_WORD_OPTIONS.filter(
      (i) => i.name.toLowerCase().substr(0, inputValue.length) === inputValue
    ).map((option) => {
      return { value: option.name, label: option.name };
    });

    callback(options.slice(0, 5));
  };

  const selectKeyDown = (e) => {
    // prevent space key
    switch (e.keyCode) {
      case 32:
        e.preventDefault();
        break;
    }
  };

  const customStyles = {
    indicatorsContainer: () => ({
      display: "none"
    }),
    control: () => ({
      border: "none",
      background: "transparent"
    }),
    input: () => ({
      textAlign: "center",
      padding: "0"
    }),
    valueContainer: () => ({
      textAlign: "center",
      padding: "0 0.1em"
    })
  };

  const value = { value: name, label: name };
  return (
    <div className={className} onPaste={onPaste}>
      <Select
        isAsync
        isSearchable
        defaultOptions
        autoFocus={autoFocus}
        disabled={disabled}
        value={value}
        onChange={({ value }) => onChange(seedWord, value)}
        valueKey="value"
        labelKey="label"
        loadOptions={getSeedWords}
        placeholder=""
        styles={customStyles}
        onKeyDown={selectKeyDown}
      />
    </div>
  );
};

export default SeedWordEntry;
