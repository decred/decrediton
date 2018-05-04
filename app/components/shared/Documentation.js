import { default as ReactMarkdown, uriTransformer }  from "react-markdown";
import { FormattedMessage as T } from "react-intl";
import { locale } from "connectors";
import Docs from "i18n/docs";
import { shell } from "electron";

// This changes absolute links (http://, https://, etc) to open as external links.
const renderDocLink = ({ href, children }) => {
  const uri = uriTransformer(href);
  return <a onClick={() => shell.openExternal(uri)} href="#">{children}</a>;
};

const DocUnavailableMsg = ({ name }) => (
  <div className="doc-unavailable-alert">
    <T id="docs.unavailable" m="Document '{name}' is unavailable in the current language. Please request it in the community channels." values={{ name }} />
  </div>
);

const Documentation = ({ currentLocaleName, name, className }) => {
  const split = (currentLocaleName||"").split("-");
  const baseLang = split[0];
  let content;
  let unavailable;
  if (Docs[currentLocaleName] && Docs[currentLocaleName][name]) content = Docs[currentLocaleName][name];
  else if (Docs[baseLang] && Docs[baseLang][name]) content = Docs[baseLang][name];
  else {
    unavailable = <DocUnavailableMsg name={name} />;
    content = Docs["en"][name] || "";
  }

  return (
    <Aux>
      <ReactMarkdown
        source={content}
        className={className}
        renderers={{ link: renderDocLink }}
      />
      {unavailable}
    </Aux>
  );
};

export default locale(Documentation);
