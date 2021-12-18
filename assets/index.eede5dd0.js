var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import { f as fp, p as pathBrowserify, o as observer, j as jsxs, F as Flex, a as jsx, C as Code, S as Stack, B as Button, W, R as RadioGroup, b as Radio, c as CheckboxGroup, d as Checkbox, t as types, u as unprotect, e as onSnapshot, g as ReactDOM, h as React, i as ChakraProvider } from "./vendor.304b2213.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
let tokens = {
  template: Symbol("template"),
  field: Symbol("field")
};
let tokenType = (token) => token.startsWith("{{#") ? tokens.template : tokens.field;
let replaceTokens = (replacers) => fp.replace(/{{#?\s*([\w\/:]+)\s*}}/g, (token, value) => fp.getOr(fp.constant(token), tokenType(token), replacers)(value, token));
let makeFieldToken = (paths) => `{{${paths.join(":")}}}`;
let makeTemplateToken = (path) => `{{#${path}}}`;
let expandTemplate = (templates) => {
  let paths = [];
  let resolvePath = (value = "") => pathBrowserify.isAbsolute(value) ? value : pathBrowserify.join(pathBrowserify.dirname(fp.last(paths) || "/"), value);
  let replacers = {
    [tokens.field]: (path) => makeFieldToken([...paths, resolvePath(path)]),
    [tokens.template]: (path, token) => {
      let absolute = resolvePath(path);
      paths.push(absolute);
      let result = replaceTokens(replacers)(templates[absolute]);
      paths.pop();
      return result || makeTemplateToken(absolute);
    }
  };
  return replaceTokens(replacers);
};
let addFieldsCounts = (counts = {}) => replaceTokens({
  [tokens.field]: (path) => {
    counts[path] = fp.add(counts[path], 1);
    return makeFieldToken([path, counts[path]]);
  }
});
let getFieldPath = fp.flow(fp.split(":"), fp.nth(-2));
let highlightTokens = (templates, fields) => replaceTokens({
  [tokens.field]: (path, token) => {
    let fieldPath = getFieldPath(path);
    let exists = fp.has(fieldPath, fields);
    let href = exists ? "href" : "";
    return `<a ${href} data-exists=${exists} data-path=${path}>${token}</a>`;
  },
  [tokens.template]: (path, token) => {
    let exists = fp.has(path, templates);
    let href = exists ? "href" : "";
    return `<a ${href} data-exists=${exists} data-path=${path}>${token}</a>`;
  }
});
let processTemplate = (templates, fields) => fp.flow(expandTemplate(templates), addFieldsCounts(), highlightTokens(templates, fields));
let foo = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
let renderTemplate = (values) => replaceTokens({
  [tokens.field]: (path, token) => {
    let value = values.get(path);
    if (!fp.isEmpty(value))
      return fp.isArray(value) ? foo.format(value) : value;
    return token;
  }
});
let getFiles = async () => {
  let result = {
    templates: {},
    fields: {}
  };
  let utf8decoder = new TextDecoder();
  for (let file of await W({
    recursive: true
  })) {
    let match = fp.head(file.name.match("(field|template)$"));
    if (match) {
      let key = file.webkitRelativePath.replace(/\w+(.*)\.(field|template)$/, (_2, path2) => path2);
      result[`${match}s`][key] = utf8decoder.decode(await file.arrayBuffer());
    }
  }
  return result;
};
let parseField = (text) => {
  let [type, ...options] = fp.map((x) => fp.trim(x, "\n"), fp.split("\n-\n", text));
  return {
    type,
    options
  };
};
let ValuePicker = (_a) => {
  var _b = _a, {
    field,
    type,
    options
  } = _b, props = __objRest(_b, [
    "field",
    "type",
    "options"
  ]);
  return type === "exclusive" ? /* @__PURE__ */ jsx(RadioGroup, __spreadProps(__spreadValues({
    size: "sm"
  }, props), {
    children: /* @__PURE__ */ jsx(Stack, {
      children: fp.map((option) => /* @__PURE__ */ jsx(Radio, {
        value: option,
        children: option
      }, option), options)
    })
  })) : /* @__PURE__ */ jsx(CheckboxGroup, __spreadProps(__spreadValues({
    size: "sm"
  }, props), {
    children: /* @__PURE__ */ jsx(Stack, {
      children: fp.map((option) => /* @__PURE__ */ jsx(Checkbox, {
        value: option,
        children: option
      }, option), options)
    })
  }));
};
let App = ({
  store: store2
}) => /* @__PURE__ */ jsxs(Flex, {
  w: "100vw",
  h: "100vh",
  fontFamily: "monospace",
  sx: {
    "> *:not(hr)": {
      flex: 1,
      p: 3,
      h: "100%",
      overflow: "scroll"
    },
    a: {
      bg: "yellow.100",
      boxShadow: "0 1px 2px 0px #ECC94B",
      "&[data-exists=true]": {
        cursor: "pointer",
        ":hover": {
          bg: "yellow.200"
        }
      },
      "&[data-exists=false]": {
        bg: "red.100",
        boxShadow: "0 1px 2px 0px #FC8181"
      },
      [`&[data-path="${store2.field}"]`]: {
        bg: "green.100",
        border: "10px black",
        boxShadow: "0 1px 2px 0px #48BB78",
        ":hover": {
          bg: "green.200"
        }
      }
    }
  },
  children: [/* @__PURE__ */ jsx(Code, {
    whiteSpace: "pre-wrap",
    dangerouslySetInnerHTML: {
      __html: renderTemplate(store2.data)(store2.template)
    },
    onClick: (e) => e.target.tagName === "A" && e.target.dataset["exists"] === "true" && (store2.field = e.target.dataset["path"])
  }), /* @__PURE__ */ jsxs(Stack, {
    children: [/* @__PURE__ */ jsx(Button, {
      size: "sm",
      onClick: async () => {
        let {
          fields,
          templates
        } = await getFiles();
        store2.templates = templates;
        store2.fields = fields;
        store2.template = processTemplate(templates, fields)("{{#nota}}");
      },
      children: "Reload files"
    }), /* @__PURE__ */ jsx(ValuePicker, __spreadValues({
      value: store2.data.get(store2.field),
      onChange: (x) => store2.data.set(store2.field, x)
    }, parseField(fp.get(getFieldPath(store2.field), store2.fields))), store2.field)]
  })]
});
var App$1 = observer(App);
var model = types.model({
  data: types.map(types.union(types.string, types.array(types.string))),
  template: types.maybe(types.string),
  field: types.maybe(types.string),
  templates: types.maybe(types.frozen(types.map(types.string))),
  fields: types.maybe(types.frozen(types.map(types.string)))
});
let storage = window.localStorage;
let store = model.create(JSON.parse(storage.getItem("store")) || void 0);
unprotect(store);
onSnapshot(store, (x) => storage.setItem("store", JSON.stringify(x)));
ReactDOM.render(/* @__PURE__ */ jsx(React.StrictMode, {
  children: /* @__PURE__ */ jsx(ChakraProvider, {
    children: /* @__PURE__ */ jsx(App$1, {
      store
    })
  })
}), document.getElementById("root"));
//# sourceMappingURL=index.eede5dd0.js.map
