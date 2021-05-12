import { wallet } from "wallet-preload-shim";
import { classNames } from "pi-ui";
import Docs from "i18n/docs";
import { default as ReactMarkdown, uriTransformer } from "react-markdown";
import { FormattedMessage as T } from "react-intl";
import { useLocale } from "hooks";
import styles from "./Documentation.module.css";

// This changes absolute links (http://, https://, etc) to open as
// external links.
const renderDocLink = ({ href, children }) => {
  const uri = uriTransformer(href);
  return (
    <a onClick={() => wallet.openExternalURL(uri)} href="#">
      {children}
    </a>
  );
};

const DocUnavailableMsg = ({ name }) => (
  <div className={styles.unavailableAlert}>
    <T
      id="docs.unavailable"
      m="Document '{name}' is unavailable in the current language. Please request it in the community channels."
      values={{ name }}
    />
  </div>
);

const Documentation = ({ name, className }) => {
  const { currentLocaleName } = useLocale();
  const split = (currentLocaleName || "").split("-");
  const baseLang = split[0];
  // dash is not allowed for module object name
  const currentLang = currentLocaleName.replace("-", "_");
  let content;
  let unavailable;
  if (Docs[currentLang] && Docs[currentLang][name])
    content = Docs[currentLang][name];
  else if (Docs[baseLang] && Docs[baseLang][name])
    content = Docs[baseLang][name];
  else {
    unavailable = <DocUnavailableMsg name={name} />;
    content = Docs["en"][name] || "";
  }

  return (
    <>
      <ReactMarkdown
        children={content}
        className={classNames(styles.documentation, className)}
        components={{ a: renderDocLink }}
      />
      {unavailable}
    </>
  );
};

export default Documentation;
