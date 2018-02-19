/**
 * This is a babel plugin to alias the defaultMessage attribute of react-intl's
 * FormattedMessage component. It allows us to change
 *
 * <T id="an.id" m="the default message" />
 *
 * into this
 *
 * <T id="an.id" m="the default message" />
 *
 */
const COMPONENT_NAMES = [
  "FormattedMessage",
];

const DESCRIPTOR_PROPS = new Set([ "m" ]);

function aliasDefaultMessagePlugin({ types: t }) {

  function referencesImport(path, mod, importedNames) {
    if (!(path.isIdentifier() || path.isJSXIdentifier())) {
      return false;
    }

    return importedNames.some((name) => path.referencesImport(mod, name));
  }

  function getModuleSourceName(opts) {
    return opts.moduleSourceName || "react-intl";
  }

  function evaluatePath(path) {
    const evaluated = path.evaluate();
    if (evaluated.confident) {
      return evaluated.value;
    }

    throw path.buildCodeFrameError(
      "[React Intl] Messages must be statically evaluate-able for extraction."
    );
  }

  function getMessageDescriptorKey(path) {
    if (path.isIdentifier() || path.isJSXIdentifier()) {
      return path.node.name;
    }

    return evaluatePath(path);
  }

  function createMessageDescriptor(propPaths) {
    return propPaths.reduce((hash, [ keyPath ]) => {
      const key = getMessageDescriptorKey(keyPath);

      if (DESCRIPTOR_PROPS.has(key)) {
        hash[key] = keyPath;
      }

      return hash;
    }, {});
  }

  return {
    visitor: {
      JSXOpeningElement(path, state) {
        const { opts } = state;
        const moduleSourceName = getModuleSourceName(opts);
        const name = path.get("name");

        if (referencesImport(name, moduleSourceName, COMPONENT_NAMES)) {
          const attributes = path.get("attributes")
            .filter((attr) => attr.isJSXAttribute());

          let descriptor = createMessageDescriptor(
            attributes.map((attr) => [
              attr.get("name"),
              attr.get("value"),
            ])
          );

          if (descriptor.m) {
            descriptor.m.replaceWith(t.JSXIdentifier("defaultMessage"));
          }
        }

      }
    }
  };
}

module.exports = aliasDefaultMessagePlugin;
