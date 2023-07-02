import { useMemo, useState, useCallback } from "react";
import LanguageSelectPage from "./Page";
import { useDaemonStartup } from "hooks";

const LanguageSelect = () => {
  const { availableLanguages, defaultLocale, onSelectLanguage, isTestNet } =
    useDaemonStartup();

  const defaultLang = useMemo(
    () =>
      availableLanguages.find((v) => v.language === defaultLocale) ||
      availableLanguages[0],
    [availableLanguages, defaultLocale]
  );

  const [selectedLang, setSelectedLang] = useState(defaultLang);

  const onSelectLang = useCallback(() => {
    onSelectLanguage(selectedLang);
  }, [onSelectLanguage, selectedLang]);

  return (
    <LanguageSelectPage
      {...{
        selectedLang,
        availableLanguages,
        onChangeSelectedLang: setSelectedLang,
        onSelectLang,
        isTestNet
      }}
    />
  );
};

export default LanguageSelect;
