import { useMemo, useState, useCallback } from "react";
import LanguageSelectPage from "./Page";
import { daemonStartup } from "connectors"; // replace with a custom hook

const LanguageSelect = ({
  availableLanguages,
  defaultLocale,
  onSelectLanguage,
  isTestNet
}) => {
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

export default daemonStartup(LanguageSelect);
