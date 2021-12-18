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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZWVkZTVkZDAuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3ZpdGUvbW9kdWxlcHJlbG9hZC1wb2x5ZmlsbCIsIi4uLy4uL3NyYy9yZW5kZXJUZW1wbGF0ZS5qcyIsIi4uLy4uL3NyYy9BcHAuanN4IiwiLi4vLi4vc3JjL21vZGVsLmpzIiwiLi4vLi4vc3JjL2luZGV4LmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwID0gZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gICAgY29uc3QgcmVsTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKS5yZWxMaXN0O1xuICAgIGlmIChyZWxMaXN0ICYmIHJlbExpc3Quc3VwcG9ydHMgJiYgcmVsTGlzdC5zdXBwb3J0cygnbW9kdWxlcHJlbG9hZCcpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yIChjb25zdCBsaW5rIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPVwibW9kdWxlcHJlbG9hZFwiXScpKSB7XG4gICAgICAgIHByb2Nlc3NQcmVsb2FkKGxpbmspO1xuICAgIH1cbiAgICBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbXV0YXRpb25zKSB7XG4gICAgICAgICAgICBpZiAobXV0YXRpb24udHlwZSAhPT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gJ0xJTksnICYmIG5vZGUucmVsID09PSAnbW9kdWxlcHJlbG9hZCcpXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NQcmVsb2FkKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSkub2JzZXJ2ZShkb2N1bWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG4gICAgZnVuY3Rpb24gZ2V0RmV0Y2hPcHRzKHNjcmlwdCkge1xuICAgICAgICBjb25zdCBmZXRjaE9wdHMgPSB7fTtcbiAgICAgICAgaWYgKHNjcmlwdC5pbnRlZ3JpdHkpXG4gICAgICAgICAgICBmZXRjaE9wdHMuaW50ZWdyaXR5ID0gc2NyaXB0LmludGVncml0eTtcbiAgICAgICAgaWYgKHNjcmlwdC5yZWZlcnJlcnBvbGljeSlcbiAgICAgICAgICAgIGZldGNoT3B0cy5yZWZlcnJlclBvbGljeSA9IHNjcmlwdC5yZWZlcnJlcnBvbGljeTtcbiAgICAgICAgaWYgKHNjcmlwdC5jcm9zc29yaWdpbiA9PT0gJ3VzZS1jcmVkZW50aWFscycpXG4gICAgICAgICAgICBmZXRjaE9wdHMuY3JlZGVudGlhbHMgPSAnaW5jbHVkZSc7XG4gICAgICAgIGVsc2UgaWYgKHNjcmlwdC5jcm9zc29yaWdpbiA9PT0gJ2Fub255bW91cycpXG4gICAgICAgICAgICBmZXRjaE9wdHMuY3JlZGVudGlhbHMgPSAnb21pdCc7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZldGNoT3B0cy5jcmVkZW50aWFscyA9ICdzYW1lLW9yaWdpbic7XG4gICAgICAgIHJldHVybiBmZXRjaE9wdHM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHByb2Nlc3NQcmVsb2FkKGxpbmspIHtcbiAgICAgICAgaWYgKGxpbmsuZXApXG4gICAgICAgICAgICAvLyBlcCBtYXJrZXIgPSBwcm9jZXNzZWRcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGluay5lcCA9IHRydWU7XG4gICAgICAgIC8vIHByZXBvcHVsYXRlIHRoZSBsb2FkIHJlY29yZFxuICAgICAgICBjb25zdCBmZXRjaE9wdHMgPSBnZXRGZXRjaE9wdHMobGluayk7XG4gICAgICAgIGZldGNoKGxpbmsuaHJlZiwgZmV0Y2hPcHRzKTtcbiAgICB9XG59O19fVklURV9JU19NT0RFUk5fXyYmcCgpOyIsImltcG9ydCBfIGZyb20gXCJsb2Rhc2gvZnBcIlxuaW1wb3J0IGYgZnJvbSBcImZ1dGlsXCJcbmltcG9ydCB7IGlzQWJzb2x1dGUsIGRpcm5hbWUsIGpvaW4gfSBmcm9tIFwicGF0aC1icm93c2VyaWZ5XCJcblxubGV0IHRva2VucyA9IHtcbiAgdGVtcGxhdGU6IFN5bWJvbChcInRlbXBsYXRlXCIpLFxuICBmaWVsZDogU3ltYm9sKFwiZmllbGRcIiksXG59XG5cbmxldCB0b2tlblR5cGUgPSAodG9rZW4pID0+XG4gIHRva2VuLnN0YXJ0c1dpdGgoXCJ7eyNcIikgPyB0b2tlbnMudGVtcGxhdGUgOiB0b2tlbnMuZmllbGRcblxubGV0IHJlcGxhY2VUb2tlbnMgPSAocmVwbGFjZXJzKSA9PlxuICBfLnJlcGxhY2UoL3t7Iz9cXHMqKFtcXHdcXC86XSspXFxzKn19L2csICh0b2tlbiwgdmFsdWUpID0+XG4gICAgXy5nZXRPcihfLmNvbnN0YW50KHRva2VuKSwgdG9rZW5UeXBlKHRva2VuKSwgcmVwbGFjZXJzKSh2YWx1ZSwgdG9rZW4pLFxuICApXG5cbmxldCBtYWtlRmllbGRUb2tlbiA9IChwYXRocykgPT4gYHt7JHtwYXRocy5qb2luKFwiOlwiKX19fWBcblxubGV0IG1ha2VUZW1wbGF0ZVRva2VuID0gKHBhdGgpID0+IGB7eyMke3BhdGh9fX1gXG5cbmV4cG9ydCBsZXQgZXhwYW5kVGVtcGxhdGUgPSAodGVtcGxhdGVzKSA9PiB7XG4gIGxldCBwYXRocyA9IFtdXG5cbiAgbGV0IHJlc29sdmVQYXRoID0gKHZhbHVlID0gXCJcIikgPT5cbiAgICBpc0Fic29sdXRlKHZhbHVlKSA/IHZhbHVlIDogam9pbihkaXJuYW1lKF8ubGFzdChwYXRocykgfHwgXCIvXCIpLCB2YWx1ZSlcblxuICBsZXQgcmVwbGFjZXJzID0ge1xuICAgIFt0b2tlbnMuZmllbGRdOiAocGF0aCkgPT4gbWFrZUZpZWxkVG9rZW4oWy4uLnBhdGhzLCByZXNvbHZlUGF0aChwYXRoKV0pLFxuICAgIFt0b2tlbnMudGVtcGxhdGVdOiAocGF0aCwgdG9rZW4pID0+IHtcbiAgICAgIGxldCBhYnNvbHV0ZSA9IHJlc29sdmVQYXRoKHBhdGgpXG4gICAgICBwYXRocy5wdXNoKGFic29sdXRlKVxuICAgICAgbGV0IHJlc3VsdCA9IHJlcGxhY2VUb2tlbnMocmVwbGFjZXJzKSh0ZW1wbGF0ZXNbYWJzb2x1dGVdKVxuICAgICAgcGF0aHMucG9wKClcbiAgICAgIHJldHVybiByZXN1bHQgfHwgbWFrZVRlbXBsYXRlVG9rZW4oYWJzb2x1dGUpXG4gICAgfSxcbiAgfVxuXG4gIHJldHVybiByZXBsYWNlVG9rZW5zKHJlcGxhY2Vycylcbn1cblxuZXhwb3J0IGxldCBhZGRGaWVsZHNDb3VudHMgPSAoY291bnRzID0ge30pID0+XG4gIHJlcGxhY2VUb2tlbnMoe1xuICAgIFt0b2tlbnMuZmllbGRdOiAocGF0aCkgPT4ge1xuICAgICAgY291bnRzW3BhdGhdID0gXy5hZGQoY291bnRzW3BhdGhdLCAxKVxuICAgICAgcmV0dXJuIG1ha2VGaWVsZFRva2VuKFtwYXRoLCBjb3VudHNbcGF0aF1dKVxuICAgIH0sXG4gIH0pXG5cbmV4cG9ydCBsZXQgZ2V0RmllbGRQYXRoID0gXy5mbG93KF8uc3BsaXQoXCI6XCIpLCBfLm50aCgtMikpXG5cbmV4cG9ydCBsZXQgaGlnaGxpZ2h0VG9rZW5zID0gKHRlbXBsYXRlcywgZmllbGRzKSA9PlxuICByZXBsYWNlVG9rZW5zKHtcbiAgICBbdG9rZW5zLmZpZWxkXTogKHBhdGgsIHRva2VuKSA9PiB7XG4gICAgICBsZXQgZmllbGRQYXRoID0gZ2V0RmllbGRQYXRoKHBhdGgpXG4gICAgICBsZXQgZXhpc3RzID0gXy5oYXMoZmllbGRQYXRoLCBmaWVsZHMpXG4gICAgICBsZXQgaHJlZiA9IGV4aXN0cyA/IFwiaHJlZlwiIDogXCJcIlxuICAgICAgcmV0dXJuIGA8YSAke2hyZWZ9IGRhdGEtZXhpc3RzPSR7ZXhpc3RzfSBkYXRhLXBhdGg9JHtwYXRofT4ke3Rva2VufTwvYT5gXG4gICAgfSxcbiAgICBbdG9rZW5zLnRlbXBsYXRlXTogKHBhdGgsIHRva2VuKSA9PiB7XG4gICAgICBsZXQgZXhpc3RzID0gXy5oYXMocGF0aCwgdGVtcGxhdGVzKVxuICAgICAgbGV0IGhyZWYgPSBleGlzdHMgPyBcImhyZWZcIiA6IFwiXCJcbiAgICAgIHJldHVybiBgPGEgJHtocmVmfSBkYXRhLWV4aXN0cz0ke2V4aXN0c30gZGF0YS1wYXRoPSR7cGF0aH0+JHt0b2tlbn08L2E+YFxuICAgIH0sXG4gIH0pXG5cbmV4cG9ydCBsZXQgcHJvY2Vzc1RlbXBsYXRlID0gKHRlbXBsYXRlcywgZmllbGRzKSA9PlxuICBfLmZsb3coXG4gICAgZXhwYW5kVGVtcGxhdGUodGVtcGxhdGVzKSxcbiAgICBhZGRGaWVsZHNDb3VudHMoKSxcbiAgICBoaWdobGlnaHRUb2tlbnModGVtcGxhdGVzLCBmaWVsZHMpLFxuICApXG5cbmxldCBmb28gPSBuZXcgSW50bC5MaXN0Rm9ybWF0KFwiZW5cIiwgeyBzdHlsZTogXCJsb25nXCIsIHR5cGU6IFwiY29uanVuY3Rpb25cIiB9KVxuXG5leHBvcnQgbGV0IHJlbmRlclRlbXBsYXRlID0gKHZhbHVlcykgPT5cbiAgcmVwbGFjZVRva2Vucyh7XG4gICAgW3Rva2Vucy5maWVsZF06IChwYXRoLCB0b2tlbikgPT4ge1xuICAgICAgbGV0IHZhbHVlID0gdmFsdWVzLmdldChwYXRoKVxuICAgICAgaWYgKCFfLmlzRW1wdHkodmFsdWUpKSByZXR1cm4gXy5pc0FycmF5KHZhbHVlKSA/IGZvby5mb3JtYXQodmFsdWUpIDogdmFsdWVcbiAgICAgIHJldHVybiB0b2tlblxuICAgIH0sXG4gIH0pXG4iLCJpbXBvcnQgXyBmcm9tIFwibG9kYXNoL2ZwXCJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoLWJyb3dzZXJpZnlcIlxuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdC1saXRlXCJcbmltcG9ydCB7IGRpcmVjdG9yeU9wZW4gfSBmcm9tIFwiYnJvd3Nlci1mcy1hY2Nlc3NcIlxuaW1wb3J0IHtcbiAgRmxleCxcbiAgQm94LFxuICBCdXR0b24sXG4gIENvZGUsXG4gIFN0YWNrLFxuICBSYWRpbyxcbiAgUmFkaW9Hcm91cCxcbiAgQ2hlY2tib3gsXG4gIENoZWNrYm94R3JvdXAsXG59IGZyb20gXCJAY2hha3JhLXVpL3JlYWN0XCJcbmltcG9ydCB7IGdldEZpZWxkUGF0aCwgcHJvY2Vzc1RlbXBsYXRlLCByZW5kZXJUZW1wbGF0ZSB9IGZyb20gXCIuL3JlbmRlclRlbXBsYXRlXCJcblxubGV0IGdldEZpbGVzID0gYXN5bmMgKCkgPT4ge1xuICBsZXQgcmVzdWx0ID0geyB0ZW1wbGF0ZXM6IHt9LCBmaWVsZHM6IHt9IH1cbiAgbGV0IHV0ZjhkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKClcbiAgZm9yIChsZXQgZmlsZSBvZiBhd2FpdCBkaXJlY3RvcnlPcGVuKHsgcmVjdXJzaXZlOiB0cnVlIH0pKSB7XG4gICAgbGV0IG1hdGNoID0gXy5oZWFkKGZpbGUubmFtZS5tYXRjaChcIihmaWVsZHx0ZW1wbGF0ZSkkXCIpKVxuICAgIGlmIChtYXRjaCkge1xuICAgICAgbGV0IGtleSA9IGZpbGUud2Via2l0UmVsYXRpdmVQYXRoLnJlcGxhY2UoXG4gICAgICAgIC9cXHcrKC4qKVxcLihmaWVsZHx0ZW1wbGF0ZSkkLyxcbiAgICAgICAgKF8sIHBhdGgpID0+IHBhdGgsXG4gICAgICApXG4gICAgICByZXN1bHRbYCR7bWF0Y2h9c2BdW2tleV0gPSB1dGY4ZGVjb2Rlci5kZWNvZGUoYXdhaXQgZmlsZS5hcnJheUJ1ZmZlcigpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0XG59XG5cbmxldCBwYXJzZUZpZWxkID0gKHRleHQpID0+IHtcbiAgbGV0IFt0eXBlLCAuLi5vcHRpb25zXSA9IF8ubWFwKCh4KSA9PiBfLnRyaW0oeCwgXCJcXG5cIiksIF8uc3BsaXQoXCJcXG4tXFxuXCIsIHRleHQpKVxuICByZXR1cm4geyB0eXBlLCBvcHRpb25zIH1cbn1cblxubGV0IFZhbHVlUGlja2VyID0gKHsgZmllbGQsIHR5cGUsIG9wdGlvbnMsIC4uLnByb3BzIH0pID0+XG4gIHR5cGUgPT09IFwiZXhjbHVzaXZlXCIgPyAoXG4gICAgPFJhZGlvR3JvdXAgc2l6ZT1cInNtXCIgey4uLnByb3BzfT5cbiAgICAgIDxTdGFjaz5cbiAgICAgICAge18ubWFwKFxuICAgICAgICAgIChvcHRpb24pID0+IChcbiAgICAgICAgICAgIDxSYWRpbyBrZXk9e29wdGlvbn0gdmFsdWU9e29wdGlvbn0+XG4gICAgICAgICAgICAgIHtvcHRpb259XG4gICAgICAgICAgICA8L1JhZGlvPlxuICAgICAgICAgICksXG4gICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgKX1cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9SYWRpb0dyb3VwPlxuICApIDogKFxuICAgIDxDaGVja2JveEdyb3VwIHNpemU9XCJzbVwiIHsuLi5wcm9wc30+XG4gICAgICA8U3RhY2s+XG4gICAgICAgIHtfLm1hcChcbiAgICAgICAgICAob3B0aW9uKSA9PiAoXG4gICAgICAgICAgICA8Q2hlY2tib3gga2V5PXtvcHRpb259IHZhbHVlPXtvcHRpb259PlxuICAgICAgICAgICAgICB7b3B0aW9ufVxuICAgICAgICAgICAgPC9DaGVja2JveD5cbiAgICAgICAgICApLFxuICAgICAgICAgIG9wdGlvbnMsXG4gICAgICAgICl9XG4gICAgICA8L1N0YWNrPlxuICAgIDwvQ2hlY2tib3hHcm91cD5cbiAgKVxuXG5sZXQgQXBwID0gKHsgc3RvcmUgfSkgPT4gKFxuICA8RmxleFxuICAgIHc9XCIxMDB2d1wiXG4gICAgaD1cIjEwMHZoXCJcbiAgICBmb250RmFtaWx5PVwibW9ub3NwYWNlXCJcbiAgICBzeD17e1xuICAgICAgXCI+ICo6bm90KGhyKVwiOiB7IGZsZXg6IDEsIHA6IDMsIGg6IFwiMTAwJVwiLCBvdmVyZmxvdzogXCJzY3JvbGxcIiB9LFxuICAgICAgYToge1xuICAgICAgICBiZzogXCJ5ZWxsb3cuMTAwXCIsXG4gICAgICAgIGJveFNoYWRvdzogXCIwIDFweCAycHggMHB4ICNFQ0M5NEJcIixcbiAgICAgICAgXCImW2RhdGEtZXhpc3RzPXRydWVdXCI6IHtcbiAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgIFwiOmhvdmVyXCI6IHsgYmc6IFwieWVsbG93LjIwMFwiIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFwiJltkYXRhLWV4aXN0cz1mYWxzZV1cIjoge1xuICAgICAgICAgIGJnOiBcInJlZC4xMDBcIixcbiAgICAgICAgICBib3hTaGFkb3c6IFwiMCAxcHggMnB4IDBweCAjRkM4MTgxXCIsXG4gICAgICAgIH0sXG4gICAgICAgIFtgJltkYXRhLXBhdGg9XCIke3N0b3JlLmZpZWxkfVwiXWBdOiB7XG4gICAgICAgICAgYmc6IFwiZ3JlZW4uMTAwXCIsXG4gICAgICAgICAgYm9yZGVyOiBcIjEwcHggYmxhY2tcIixcbiAgICAgICAgICBib3hTaGFkb3c6IFwiMCAxcHggMnB4IDBweCAjNDhCQjc4XCIsXG4gICAgICAgICAgXCI6aG92ZXJcIjogeyBiZzogXCJncmVlbi4yMDBcIiB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9fVxuICA+XG4gICAgPENvZGVcbiAgICAgIHdoaXRlU3BhY2U9XCJwcmUtd3JhcFwiXG4gICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e1xuICAgICAgICBfX2h0bWw6IHJlbmRlclRlbXBsYXRlKHN0b3JlLmRhdGEpKHN0b3JlLnRlbXBsYXRlKSxcbiAgICAgIH19XG4gICAgICBvbkNsaWNrPXsoZSkgPT5cbiAgICAgICAgZS50YXJnZXQudGFnTmFtZSA9PT0gXCJBXCIgJiZcbiAgICAgICAgZS50YXJnZXQuZGF0YXNldFtcImV4aXN0c1wiXSA9PT0gXCJ0cnVlXCIgJiZcbiAgICAgICAgKHN0b3JlLmZpZWxkID0gZS50YXJnZXQuZGF0YXNldFtcInBhdGhcIl0pXG4gICAgICB9XG4gICAgLz5cbiAgICA8U3RhY2s+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgIG9uQ2xpY2s9e2FzeW5jICgpID0+IHtcbiAgICAgICAgICBsZXQgeyBmaWVsZHMsIHRlbXBsYXRlcyB9ID0gYXdhaXQgZ2V0RmlsZXMoKVxuICAgICAgICAgIHN0b3JlLnRlbXBsYXRlcyA9IHRlbXBsYXRlc1xuICAgICAgICAgIHN0b3JlLmZpZWxkcyA9IGZpZWxkc1xuICAgICAgICAgIHN0b3JlLnRlbXBsYXRlID0gcHJvY2Vzc1RlbXBsYXRlKHRlbXBsYXRlcywgZmllbGRzKShcInt7I25vdGF9fVwiKVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICBSZWxvYWQgZmlsZXNcbiAgICAgIDwvQnV0dG9uPlxuICAgICAgPFZhbHVlUGlja2VyXG4gICAgICAgIGtleT17c3RvcmUuZmllbGR9XG4gICAgICAgIHZhbHVlPXtzdG9yZS5kYXRhLmdldChzdG9yZS5maWVsZCl9XG4gICAgICAgIG9uQ2hhbmdlPXsoeCkgPT4gc3RvcmUuZGF0YS5zZXQoc3RvcmUuZmllbGQsIHgpfVxuICAgICAgICB7Li4ucGFyc2VGaWVsZChfLmdldChnZXRGaWVsZFBhdGgoc3RvcmUuZmllbGQpLCBzdG9yZS5maWVsZHMpKX1cbiAgICAgIC8+XG4gICAgPC9TdGFjaz5cbiAgPC9GbGV4PlxuKVxuXG5leHBvcnQgZGVmYXVsdCBvYnNlcnZlcihBcHApXG4iLCJpbXBvcnQgXyBmcm9tIFwibG9kYXNoL2ZwXCJcbmltcG9ydCB7IHR5cGVzIH0gZnJvbSBcIm1vYngtc3RhdGUtdHJlZVwiXG5cbmV4cG9ydCBkZWZhdWx0IHR5cGVzLm1vZGVsKHtcbiAgZGF0YTogdHlwZXMubWFwKHR5cGVzLnVuaW9uKHR5cGVzLnN0cmluZywgdHlwZXMuYXJyYXkodHlwZXMuc3RyaW5nKSkpLFxuICB0ZW1wbGF0ZTogdHlwZXMubWF5YmUodHlwZXMuc3RyaW5nKSxcbiAgZmllbGQ6IHR5cGVzLm1heWJlKHR5cGVzLnN0cmluZyksXG4gIHRlbXBsYXRlczogdHlwZXMubWF5YmUodHlwZXMuZnJvemVuKHR5cGVzLm1hcCh0eXBlcy5zdHJpbmcpKSksXG4gIGZpZWxkczogdHlwZXMubWF5YmUodHlwZXMuZnJvemVuKHR5cGVzLm1hcCh0eXBlcy5zdHJpbmcpKSksXG59KVxuIiwiaW1wb3J0IF8gZnJvbSBcImxvZGFzaC9mcFwiXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCJcbmltcG9ydCBSZWFjdERPTSBmcm9tIFwicmVhY3QtZG9tXCJcbmltcG9ydCB7IENoYWtyYVByb3ZpZGVyLCBleHRlbmRUaGVtZSB9IGZyb20gXCJAY2hha3JhLXVpL3JlYWN0XCJcbmltcG9ydCB7IG9uU25hcHNob3QsIGdldFNuYXBzaG90LCB1bnByb3RlY3QgfSBmcm9tIFwibW9ieC1zdGF0ZS10cmVlXCJcbmltcG9ydCBBcHAgZnJvbSBcIi4vQXBwXCJcbmltcG9ydCBtb2RlbCBmcm9tIFwiLi9tb2RlbFwiXG5cbmxldCBzdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZVxuXG5sZXQgc3RvcmUgPSBtb2RlbC5jcmVhdGUoSlNPTi5wYXJzZShzdG9yYWdlLmdldEl0ZW0oXCJzdG9yZVwiKSkgfHwgdW5kZWZpbmVkKVxuXG51bnByb3RlY3Qoc3RvcmUpXG5cbm9uU25hcHNob3Qoc3RvcmUsICh4KSA9PiBzdG9yYWdlLnNldEl0ZW0oXCJzdG9yZVwiLCBKU09OLnN0cmluZ2lmeSh4KSkpXG5cblxuUmVhY3RET00ucmVuZGVyKFxuICA8UmVhY3QuU3RyaWN0TW9kZT5cbiAgICA8Q2hha3JhUHJvdmlkZXI+XG4gICAgICA8QXBwIHN0b3JlPXtzdG9yZX0gLz5cbiAgICA8L0NoYWtyYVByb3ZpZGVyPlxuICA8L1JlYWN0LlN0cmljdE1vZGU+LFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIiksXG4pXG4iXSwibmFtZXMiOlsiXyIsImlzQWJzb2x1dGUiLCJqb2luIiwiZGlybmFtZSIsImdldEZpbGVzIiwicmVzdWx0IiwidGVtcGxhdGVzIiwiZmllbGRzIiwidXRmOGRlY29kZXIiLCJUZXh0RGVjb2RlciIsImZpbGUiLCJkaXJlY3RvcnlPcGVuIiwicmVjdXJzaXZlIiwibWF0Y2giLCJoZWFkIiwibmFtZSIsImtleSIsIndlYmtpdFJlbGF0aXZlUGF0aCIsInJlcGxhY2UiLCJwYXRoIiwiZGVjb2RlIiwiYXJyYXlCdWZmZXIiLCJwYXJzZUZpZWxkIiwidGV4dCIsInR5cGUiLCJvcHRpb25zIiwibWFwIiwieCIsInRyaW0iLCJzcGxpdCIsIlZhbHVlUGlja2VyIiwiZmllbGQiLCJwcm9wcyIsIm9wdGlvbiIsIkFwcCIsInN0b3JlIiwiZmxleCIsInAiLCJoIiwib3ZlcmZsb3ciLCJhIiwiYmciLCJib3hTaGFkb3ciLCJjdXJzb3IiLCJib3JkZXIiLCJfX2h0bWwiLCJyZW5kZXJUZW1wbGF0ZSIsImRhdGEiLCJ0ZW1wbGF0ZSIsImUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwiZGF0YXNldCIsInByb2Nlc3NUZW1wbGF0ZSIsImdldCIsInNldCIsImdldEZpZWxkUGF0aCIsIm9ic2VydmVyIiwic3RvcmFnZSIsIndpbmRvdyIsImxvY2FsU3RvcmFnZSIsIm1vZGVsIiwiY3JlYXRlIiwiSlNPTiIsInBhcnNlIiwiZ2V0SXRlbSIsInVuZGVmaW5lZCIsInVucHJvdGVjdCIsIm9uU25hcHNob3QiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiUmVhY3RET00iLCJyZW5kZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQU0sSUFBSSxvQkFBb0I7QUFDMUIsUUFBTSxVQUFVLFNBQVMsY0FBYyxRQUFRO0FBQy9DLE1BQUksV0FBVyxRQUFRLFlBQVksUUFBUSxTQUFTLGtCQUFrQjtBQUNsRTtBQUFBO0FBRUosYUFBVyxRQUFRLFNBQVMsaUJBQWlCLDhCQUE4QjtBQUN2RSxtQkFBZTtBQUFBO0FBRW5CLE1BQUksaUJBQWlCLENBQUMsY0FBYztBQUNoQyxlQUFXLFlBQVksV0FBVztBQUM5QixVQUFJLFNBQVMsU0FBUyxhQUFhO0FBQy9CO0FBQUE7QUFF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
