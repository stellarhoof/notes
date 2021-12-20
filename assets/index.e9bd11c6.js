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
import { f as fp, p as pathBrowserify, a as f, W, o as observer, j as jsx, b as jsxs, F as Flex, S as Stack, B as Box, R as React, c as Button, C as CheckboxGroup, d as Checkbox, e as RadioGroup, g as Radio, t as types, h as configure, u as unprotect, i as onSnapshot, k as ReactDOM, l as ChakraProvider } from "./vendor.c88f01e0.js";
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
let abs = (x) => pathBrowserify.resolve("/", x);
let delimjoin = (...args) => fp.join(pathBrowserify.delimiter, fp.compact(args));
let delimsplit = fp.split(pathBrowserify.delimiter);
let dropdirs = (n, x) => {
  let [first, ...rest] = fp.split(pathBrowserify.sep, x);
  return fp.join(pathBrowserify.sep, first === "" ? [first, ...fp.drop(n, rest)] : fp.drop(n, [first, ...rest]));
};
var path = __spreadProps(__spreadValues({}, pathBrowserify), { abs, delimjoin, delimsplit, dropdirs });
let match = fp.curry((pattern, str) => str == null ? void 0 : str.match(pattern));
let writeProperty = (next = traverse) => (node, index, [parent]) => {
  if (parent)
    f.setOn(index, node, next(parent));
};
let transformTree = (next = f.traverse) => (...args) => (tree2) => {
  let result = fp.cloneDeep(tree2);
  f.walk(next)(...args)(result);
  return result;
};
let mapTree = (next = f.traverse, writeNode = writeProperty(next)) => (pre, post = fp.identity, ...args) => {
  let write = (fn) => (node, ...args2) => {
    writeNode(fn(node, ...args2), ...args2);
  };
  return fp.flow(pre, transformTree(next)(write(pre), write(post), ...args), post);
};
let buildTree$1 = (next = f.traverse, writeNode = writeProperty(next)) => (generateNext) => transformTree(generateNext)(writeNode);
let tree = (next = traverse, buildIteratee = fp.identity, writeNode = writeProperty(next)) => ({
  walk: f.walk(next),
  walkAsync: f.walkAsync(next),
  transform: transformTree(next),
  reduce: f.reduceTree(next),
  toArrayBy: f.treeToArrayBy(next),
  toArray: f.treeToArray(next),
  leaves: f.leaves(next),
  leavesBy: f.leavesBy(next),
  lookup: f.treeLookup(next, buildIteratee),
  keyByWith: f.keyTreeByWith(next),
  traverse: next,
  flatten: f.flattenTree(next),
  flatLeaves: f.flatLeaves(next),
  map: mapTree(next, writeNode),
  mapLeaves: f.mapTreeLeaves(next, writeNode),
  build: buildTree$1(next, writeNode)
});
let readFiles = async (_a) => {
  var _b = _a, { filter } = _b, options = __objRest(_b, ["filter"]);
  let files = await W(options);
  if (filter)
    files = files.filter((file) => filter(file.name));
  let promises = files.map(async (file) => {
    file.data = new TextDecoder().decode(await file.arrayBuffer());
  });
  await Promise.all(promises);
  return files;
};
let isTemplateId = fp.flow(match(/\.temp:\d+$/));
let pathFromId = fp.flow(path.delimsplit, fp.nth(-2));
let Tree = tree(fp.get("children"), fp.identity, (node, index, [parent]) => {
  f.setOn(["children", index], node, parent);
});
let tokenize = fp.flow(fp.split(/({{.+?}})/), fp.compact);
let buildTree = (getValue) => {
  let getPath = (token) => fp.nth(1, token.match(/^{{\s*(.*)\s*}}$/));
  let cache = {};
  let genId = (parent, tokenPath) => {
    let fullpath = path.resolve(path.dirname(pathFromId(parent.id)), tokenPath);
    let key = path.delimjoin(parent.id, fullpath);
    cache[key] = fp.add(cache[key], 1);
    return path.delimjoin(key, cache[key]);
  };
  return Tree.build((node) => fp.map(f.when(getPath, (x) => ({ id: genId(node, getPath(x)) })), tokenize(getValue(node.id))));
};
let makeVariant = (color) => ({
  bg: `${color}.100`,
  borderRight: "3px solid",
  borderLeft: "3px solid",
  borderColor: `${color}.400`
});
let defaultRenderToken = (props) => /* @__PURE__ */ jsx("span", __spreadValues({}, props));
let RenderTemplate = (_c) => {
  var _d = _c, {
    store: store2,
    tree: tree2,
    sx,
    renderToken = defaultRenderToken
  } = _d, props = __objRest(_d, [
    "store",
    "tree",
    "sx",
    "renderToken"
  ]);
  return /* @__PURE__ */ jsx(Box, __spreadProps(__spreadValues({
    as: "span",
    sx: __spreadValues({
      whiteSpace: "pre-wrap",
      "[data-id]": {
        cursor: "pointer",
        textDecoration: "none"
      },
      ".variant0": makeVariant("green"),
      ".variant1": makeVariant("teal"),
      ".variant2": makeVariant("blue"),
      ".variant3": makeVariant("cyan"),
      ".variant4": makeVariant("purple")
    }, sx)
  }, props), {
    children: Tree.map(fp.identity, (node, i, parents) => {
      if (fp.isString(node))
        return node;
      if (!store2.getParsedFile(node.id))
        return /* @__PURE__ */ jsx(Box, {
          as: "span",
          bg: "gray.100",
          textDecoration: "line-through",
          children: pathFromId(node.id)
        }, node.id);
      if (isTemplateId(node.id) && !fp.isEmpty(node.children))
        return /* @__PURE__ */ jsx(React.Fragment, {
          children: node.children
        }, node.id);
      let depth = fp.filter((x) => !isTemplateId(x.id), parents).length;
      return renderToken({
        key: node.id,
        ["data-id"]: node.id,
        className: `variant${depth % 5}`,
        children: fp.isEmpty(node.children) ? pathFromId(node.id) : node.children
      });
    })(tree2)
  }));
};
let MultipleValuePicker = (_e) => {
  var _f = _e, {
    options,
    children
  } = _f, props = __objRest(_f, [
    "options",
    "children"
  ]);
  return /* @__PURE__ */ jsx(CheckboxGroup, __spreadProps(__spreadValues({}, props), {
    children: /* @__PURE__ */ jsx(Stack, {
      children: fp.map((option) => /* @__PURE__ */ jsx(Checkbox, {
        value: option,
        children: children(option)
      }, option), options)
    })
  }));
};
let ExclusiveValuePicker = (_g) => {
  var _h = _g, {
    options,
    children
  } = _h, props = __objRest(_h, [
    "options",
    "children"
  ]);
  return /* @__PURE__ */ jsx(RadioGroup, __spreadProps(__spreadValues({}, props), {
    children: /* @__PURE__ */ jsx(Stack, {
      children: fp.map((option) => /* @__PURE__ */ jsx(Radio, {
        value: option,
        children: children(option)
      }, option), options)
    })
  }));
};
let EmptyValuePicker = () => null;
let ValuePicker = observer((_i) => {
  var _j = _i, {
    store: store2
  } = _j, props = __objRest(_j, [
    "store"
  ]);
  let {
    type = "default",
    options = []
  } = store2.getParsedFile(store2.id) || {};
  let Component = {
    exclusive: ExclusiveValuePicker,
    multiple: MultipleValuePicker,
    default: EmptyValuePicker
  }[type];
  return /* @__PURE__ */ jsx(Component, __spreadProps(__spreadValues({
    size: "sm",
    value: f.when(fp.isArray, fp.toArray)(store2.values.get(store2.id)),
    onChange: (x) => store2.values.set(store2.id, x),
    options
  }, props), {
    children: (option) => /* @__PURE__ */ jsx(RenderTemplate, {
      store: store2,
      tree: buildTree(f.getIn({
        [`${store2.path}:1`]: option
      }))({
        id: `${store2.path}:1`
      })
    })
  }), store2.id);
});
let ReloadFiles = ({
  store: store2
}) => /* @__PURE__ */ jsx(Button, {
  size: "sm",
  onClick: async () => {
    let files = await readFiles({
      recursive: true,
      filter: match(/\.(field|temp)$/)
    });
    store2.setTemplates(files.filter((x) => x.name.endsWith(".temp")));
    store2.setFields(files.filter((x) => x.name.endsWith(".field")));
  },
  children: "Reload files"
});
let Note = observer((_k) => {
  var _l = _k, {
    store: store2
  } = _l, props = __objRest(_l, [
    "store"
  ]);
  return /* @__PURE__ */ jsx(RenderTemplate, __spreadValues({
    store: store2,
    tree: buildTree(store2.getValue)({
      id: `${store2.path}:1`
    }),
    renderToken: (props2) => /* @__PURE__ */ jsx("a", __spreadValues({
      href: "#",
      onClick: (e) => store2.paths.set(store2.path, e.target.dataset.id)
    }, props2))
  }, props));
});
let FilePicker = ({
  store: store2
}) => /* @__PURE__ */ jsx(Stack, {
  children: fp.map((path2) => /* @__PURE__ */ jsx(Box, {
    children: /* @__PURE__ */ jsx(Button, {
      variant: "link",
      size: "sm",
      colorScheme: "black",
      onClick: () => store2.path = path2,
      children: path2
    })
  }, path2), fp.keys(__spreadValues(__spreadValues({}, store2.templates), store2.fields)))
});
let App = ({
  store: store2
}) => /* @__PURE__ */ jsxs(Flex, {
  w: "100vw",
  h: "100vh",
  fontFamily: "monospace",
  sx: {
    "> *:not(hr)": {
      p: 3,
      h: "100%",
      overflow: "scroll"
    }
  },
  children: [/* @__PURE__ */ jsxs(Stack, {
    flexBasis: "20%",
    children: [/* @__PURE__ */ jsx(ReloadFiles, {
      store: store2
    }), /* @__PURE__ */ jsx(FilePicker, {
      store: store2,
      flex: 1
    })]
  }), /* @__PURE__ */ jsx(Note, {
    store: store2,
    flexBasis: "40%"
  }), /* @__PURE__ */ jsx(Box, {
    flexBasis: "40%",
    children: /* @__PURE__ */ jsx(ValuePicker, {
      store: store2,
      w: "100%"
    })
  })]
});
let parseField = (text) => {
  let [type, ...options] = fp.map((x) => fp.trim(x, "\n"), fp.split(/\n\s*-\s*\n/, text));
  return { type, options };
};
let parseFiles = (parse) => fp.flow(fp.keyBy((file) => path.dropdirs(1, path.abs(file.webkitRelativePath))), fp.mapValues((x) => parse(x.data)));
let Field = types.model({
  type: types.enumeration(["exclusive", "multiple"]),
  options: types.array(types.string)
});
var model = types.model({
  path: types.maybe(types.string),
  paths: types.map(types.string),
  values: types.map(types.union(types.string, types.array(types.string))),
  templates: types.optional(types.frozen(types.map(types.string)), {}),
  fields: types.optional(types.frozen(types.map(Field)), {})
}).views((self) => ({
  get id() {
    return self.paths.get(self.path);
  },
  getValue(id) {
    return isTemplateId(id) ? self.templates[pathFromId(id)] : self.values.get(id);
  },
  getParsedFile(id) {
    return isTemplateId(id) ? self.templates[pathFromId(id)] : self.fields[pathFromId(id)];
  }
})).actions((self) => ({
  setTemplates(files) {
    self.templates = parseFiles(fp.replace(/\n*$/, ""))(files);
  },
  setFields(files) {
    self.fields = parseFiles(parseField)(files);
  }
}));
configure({
  enforceActions: "never"
});
let storage = window.localStorage;
let store = model.create(JSON.parse(storage.getItem("store")) || void 0);
unprotect(store);
onSnapshot(store, (x) => storage.setItem("store", JSON.stringify(x)));
ReactDOM.render(/* @__PURE__ */ jsx(React.StrictMode, {
  children: /* @__PURE__ */ jsx(ChakraProvider, {
    children: /* @__PURE__ */ jsx(App, {
      store
    })
  })
}), document.getElementById("root"));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZTliZDExYzYuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3ZpdGUvbW9kdWxlcHJlbG9hZC1wb2x5ZmlsbCIsIi4uLy4uL3NyYy9wYXRoLmpzIiwiLi4vLi4vc3JjL2Z1dGlsLmpzIiwiLi4vLi4vc3JjL2Jyb3dzZXItZnMtYWNjZXNzLmpzIiwiLi4vLi4vc3JjL3RyZWUuanMiLCIuLi8uLi9zcmMvQXBwLmpzeCIsIi4uLy4uL3NyYy9tb2RlbC5qcyIsIi4uLy4uL3NyYy9pbmRleC5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcCA9IGZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICAgIGNvbnN0IHJlbExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJykucmVsTGlzdDtcbiAgICBpZiAocmVsTGlzdCAmJiByZWxMaXN0LnN1cHBvcnRzICYmIHJlbExpc3Quc3VwcG9ydHMoJ21vZHVsZXByZWxvYWQnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgbGluayBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cIm1vZHVsZXByZWxvYWRcIl0nKSkge1xuICAgICAgICBwcm9jZXNzUHJlbG9hZChsaW5rKTtcbiAgICB9XG4gICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xuICAgICAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgIT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgbXV0YXRpb24uYWRkZWROb2Rlcykge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnRhZ05hbWUgPT09ICdMSU5LJyAmJiBub2RlLnJlbCA9PT0gJ21vZHVsZXByZWxvYWQnKVxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzUHJlbG9hZChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pLm9ic2VydmUoZG9jdW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuICAgIGZ1bmN0aW9uIGdldEZldGNoT3B0cyhzY3JpcHQpIHtcbiAgICAgICAgY29uc3QgZmV0Y2hPcHRzID0ge307XG4gICAgICAgIGlmIChzY3JpcHQuaW50ZWdyaXR5KVxuICAgICAgICAgICAgZmV0Y2hPcHRzLmludGVncml0eSA9IHNjcmlwdC5pbnRlZ3JpdHk7XG4gICAgICAgIGlmIChzY3JpcHQucmVmZXJyZXJwb2xpY3kpXG4gICAgICAgICAgICBmZXRjaE9wdHMucmVmZXJyZXJQb2xpY3kgPSBzY3JpcHQucmVmZXJyZXJwb2xpY3k7XG4gICAgICAgIGlmIChzY3JpcHQuY3Jvc3NvcmlnaW4gPT09ICd1c2UtY3JlZGVudGlhbHMnKVxuICAgICAgICAgICAgZmV0Y2hPcHRzLmNyZWRlbnRpYWxzID0gJ2luY2x1ZGUnO1xuICAgICAgICBlbHNlIGlmIChzY3JpcHQuY3Jvc3NvcmlnaW4gPT09ICdhbm9ueW1vdXMnKVxuICAgICAgICAgICAgZmV0Y2hPcHRzLmNyZWRlbnRpYWxzID0gJ29taXQnO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmZXRjaE9wdHMuY3JlZGVudGlhbHMgPSAnc2FtZS1vcmlnaW4nO1xuICAgICAgICByZXR1cm4gZmV0Y2hPcHRzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwcm9jZXNzUHJlbG9hZChsaW5rKSB7XG4gICAgICAgIGlmIChsaW5rLmVwKVxuICAgICAgICAgICAgLy8gZXAgbWFya2VyID0gcHJvY2Vzc2VkXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGxpbmsuZXAgPSB0cnVlO1xuICAgICAgICAvLyBwcmVwb3B1bGF0ZSB0aGUgbG9hZCByZWNvcmRcbiAgICAgICAgY29uc3QgZmV0Y2hPcHRzID0gZ2V0RmV0Y2hPcHRzKGxpbmspO1xuICAgICAgICBmZXRjaChsaW5rLmhyZWYsIGZldGNoT3B0cyk7XG4gICAgfVxufTtfX1ZJVEVfSVNfTU9ERVJOX18mJnAoKTsiLCJpbXBvcnQgXyBmcm9tIFwibG9kYXNoL2ZwXCJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoLWJyb3dzZXJpZnlcIlxuXG5sZXQgYWJzID0gKHgpID0+IHBhdGgucmVzb2x2ZShcIi9cIiwgeClcblxubGV0IGRlbGltam9pbiA9ICguLi5hcmdzKSA9PiBfLmpvaW4ocGF0aC5kZWxpbWl0ZXIsIF8uY29tcGFjdChhcmdzKSlcblxubGV0IGRlbGltc3BsaXQgPSBfLnNwbGl0KHBhdGguZGVsaW1pdGVyKVxuXG5sZXQgZHJvcGRpcnMgPSAobiwgeCkgPT4ge1xuICBsZXQgW2ZpcnN0LCAuLi5yZXN0XSA9IF8uc3BsaXQocGF0aC5zZXAsIHgpXG4gIHJldHVybiBfLmpvaW4oXG4gICAgcGF0aC5zZXAsXG4gICAgZmlyc3QgPT09IFwiXCIgPyBbZmlyc3QsIC4uLl8uZHJvcChuLCByZXN0KV0gOiBfLmRyb3AobiwgW2ZpcnN0LCAuLi5yZXN0XSksXG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgeyAuLi5wYXRoLCBhYnMsIGRlbGltam9pbiwgZGVsaW1zcGxpdCwgZHJvcGRpcnMgfVxuIiwiaW1wb3J0IGYgZnJvbSBcImZ1dGlsXCJcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2gvZnBcIlxuXG5leHBvcnQgbGV0IG1hdGNoID0gXy5jdXJyeSgocGF0dGVybiwgc3RyKSA9PiBzdHI/Lm1hdGNoKHBhdHRlcm4pKVxuXG5sZXQgd3JpdGVQcm9wZXJ0eSA9XG4gIChuZXh0ID0gdHJhdmVyc2UpID0+XG4gIChub2RlLCBpbmRleCwgW3BhcmVudF0pID0+IHtcbiAgICBpZiAocGFyZW50KSBmLnNldE9uKGluZGV4LCBub2RlLCBuZXh0KHBhcmVudCkpXG4gIH1cblxubGV0IHRyYW5zZm9ybVRyZWUgPVxuICAobmV4dCA9IGYudHJhdmVyc2UpID0+XG4gICguLi5hcmdzKSA9PlxuICAodHJlZSkgPT4ge1xuICAgIGxldCByZXN1bHQgPSBfLmNsb25lRGVlcCh0cmVlKVxuICAgIGYud2FsayhuZXh0KSguLi5hcmdzKShyZXN1bHQpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbmxldCBtYXBUcmVlID1cbiAgKG5leHQgPSBmLnRyYXZlcnNlLCB3cml0ZU5vZGUgPSB3cml0ZVByb3BlcnR5KG5leHQpKSA9PlxuICAocHJlLCBwb3N0ID0gXy5pZGVudGl0eSwgLi4uYXJncykgPT4ge1xuICAgIGxldCB3cml0ZSA9XG4gICAgICAoZm4pID0+XG4gICAgICAobm9kZSwgLi4uYXJncykgPT4ge1xuICAgICAgICB3cml0ZU5vZGUoZm4obm9kZSwgLi4uYXJncyksIC4uLmFyZ3MpXG4gICAgICB9XG4gICAgcmV0dXJuIF8uZmxvdyhcbiAgICAgIHByZSxcbiAgICAgIHRyYW5zZm9ybVRyZWUobmV4dCkod3JpdGUocHJlKSwgd3JpdGUocG9zdCksIC4uLmFyZ3MpLFxuICAgICAgcG9zdCxcbiAgICApXG4gIH1cblxubGV0IGJ1aWxkVHJlZSA9XG4gIChuZXh0ID0gZi50cmF2ZXJzZSwgd3JpdGVOb2RlID0gd3JpdGVQcm9wZXJ0eShuZXh0KSkgPT5cbiAgKGdlbmVyYXRlTmV4dCkgPT5cbiAgICB0cmFuc2Zvcm1UcmVlKGdlbmVyYXRlTmV4dCkod3JpdGVOb2RlKVxuXG5leHBvcnQgbGV0IHRyZWUgPSAoXG4gIG5leHQgPSB0cmF2ZXJzZSxcbiAgYnVpbGRJdGVyYXRlZSA9IF8uaWRlbnRpdHksXG4gIHdyaXRlTm9kZSA9IHdyaXRlUHJvcGVydHkobmV4dCksXG4pID0+ICh7XG4gIHdhbGs6IGYud2FsayhuZXh0KSxcbiAgd2Fsa0FzeW5jOiBmLndhbGtBc3luYyhuZXh0KSxcbiAgdHJhbnNmb3JtOiB0cmFuc2Zvcm1UcmVlKG5leHQpLFxuICByZWR1Y2U6IGYucmVkdWNlVHJlZShuZXh0KSxcbiAgdG9BcnJheUJ5OiBmLnRyZWVUb0FycmF5QnkobmV4dCksXG4gIHRvQXJyYXk6IGYudHJlZVRvQXJyYXkobmV4dCksXG4gIGxlYXZlczogZi5sZWF2ZXMobmV4dCksXG4gIGxlYXZlc0J5OiBmLmxlYXZlc0J5KG5leHQpLFxuICBsb29rdXA6IGYudHJlZUxvb2t1cChuZXh0LCBidWlsZEl0ZXJhdGVlKSxcbiAga2V5QnlXaXRoOiBmLmtleVRyZWVCeVdpdGgobmV4dCksXG4gIHRyYXZlcnNlOiBuZXh0LFxuICBmbGF0dGVuOiBmLmZsYXR0ZW5UcmVlKG5leHQpLFxuICBmbGF0TGVhdmVzOiBmLmZsYXRMZWF2ZXMobmV4dCksXG4gIG1hcDogbWFwVHJlZShuZXh0LCB3cml0ZU5vZGUpLFxuICBtYXBMZWF2ZXM6IGYubWFwVHJlZUxlYXZlcyhuZXh0LCB3cml0ZU5vZGUpLFxuICBidWlsZDogYnVpbGRUcmVlKG5leHQsIHdyaXRlTm9kZSksXG59KVxuIiwiaW1wb3J0IHsgZGlyZWN0b3J5T3BlbiB9IGZyb20gXCJicm93c2VyLWZzLWFjY2Vzc1wiXG5cbmV4cG9ydCBsZXQgcmVhZEZpbGVzID0gYXN5bmMgKHsgZmlsdGVyLCAuLi5vcHRpb25zIH0pID0+IHtcbiAgbGV0IGZpbGVzID0gYXdhaXQgZGlyZWN0b3J5T3BlbihvcHRpb25zKVxuICBpZiAoZmlsdGVyKSBmaWxlcyA9IGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsdGVyKGZpbGUubmFtZSkpXG4gIGxldCBwcm9taXNlcyA9IGZpbGVzLm1hcChhc3luYyAoZmlsZSkgPT4ge1xuICAgIGZpbGUuZGF0YSA9IG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShhd2FpdCBmaWxlLmFycmF5QnVmZmVyKCkpXG4gIH0pXG4gIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKVxuICByZXR1cm4gZmlsZXNcbn1cbiIsImltcG9ydCBfIGZyb20gXCJsb2Rhc2gvZnBcIlxuaW1wb3J0IGYgZnJvbSBcImZ1dGlsXCJcbmltcG9ydCBwYXRoIGZyb20gXCIuL3BhdGhcIlxuaW1wb3J0IHsgdHJlZSwgbWF0Y2ggfSBmcm9tIFwiLi9mdXRpbFwiXG5cbmV4cG9ydCBsZXQgaXNUZW1wbGF0ZUlkID0gXy5mbG93KG1hdGNoKC9cXC50ZW1wOlxcZCskLykpXG5cbmV4cG9ydCBsZXQgcGF0aEZyb21JZCA9IF8uZmxvdyhwYXRoLmRlbGltc3BsaXQsIF8ubnRoKC0yKSlcblxuZXhwb3J0IGxldCBUcmVlID0gdHJlZShcbiAgXy5nZXQoXCJjaGlsZHJlblwiKSxcbiAgXy5pZGVudGl0eSxcbiAgKG5vZGUsIGluZGV4LCBbcGFyZW50XSkgPT4ge1xuICAgIGYuc2V0T24oW1wiY2hpbGRyZW5cIiwgaW5kZXhdLCBub2RlLCBwYXJlbnQpXG4gIH0sXG4pXG5cbmxldCB0b2tlbml6ZSA9IF8uZmxvdyhfLnNwbGl0KC8oe3suKz99fSkvKSwgXy5jb21wYWN0KVxuXG5leHBvcnQgbGV0IGJ1aWxkVHJlZSA9IChnZXRWYWx1ZSkgPT4ge1xuICBsZXQgZ2V0UGF0aCA9ICh0b2tlbikgPT4gXy5udGgoMSwgdG9rZW4ubWF0Y2goL157e1xccyooLiopXFxzKn19JC8pKVxuXG4gIGxldCBjYWNoZSA9IHt9XG5cbiAgbGV0IGdlbklkID0gKHBhcmVudCwgdG9rZW5QYXRoKSA9PiB7XG4gICAgbGV0IGZ1bGxwYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShwYXRoRnJvbUlkKHBhcmVudC5pZCkpLCB0b2tlblBhdGgpXG4gICAgbGV0IGtleSA9IHBhdGguZGVsaW1qb2luKHBhcmVudC5pZCwgZnVsbHBhdGgpXG4gICAgY2FjaGVba2V5XSA9IF8uYWRkKGNhY2hlW2tleV0sIDEpXG4gICAgcmV0dXJuIHBhdGguZGVsaW1qb2luKGtleSwgY2FjaGVba2V5XSlcbiAgfVxuXG4gIHJldHVybiBUcmVlLmJ1aWxkKChub2RlKSA9PlxuICAgIF8ubWFwKFxuICAgICAgZi53aGVuKGdldFBhdGgsICh4KSA9PiAoeyBpZDogZ2VuSWQobm9kZSwgZ2V0UGF0aCh4KSkgfSkpLFxuICAgICAgdG9rZW5pemUoZ2V0VmFsdWUobm9kZS5pZCkpLFxuICAgICksXG4gIClcbn1cbiIsImltcG9ydCBfIGZyb20gXCJsb2Rhc2gvZnBcIlxuaW1wb3J0IGYgZnJvbSBcImZ1dGlsXCJcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdC1saXRlXCJcbmltcG9ydCB7XG4gIEZsZXgsXG4gIEJveCxcbiAgQnV0dG9uLFxuICBDZW50ZXIsXG4gIEhlYWRpbmcsXG4gIENvZGUsXG4gIFN0YWNrLFxuICBSYWRpbyxcbiAgUmFkaW9Hcm91cCxcbiAgQ2hlY2tib3gsXG4gIENoZWNrYm94R3JvdXAsXG59IGZyb20gXCJAY2hha3JhLXVpL3JlYWN0XCJcbmltcG9ydCBwYXRoIGZyb20gXCIuL3BhdGhcIlxuaW1wb3J0IHsgbWF0Y2ggfSBmcm9tIFwiLi9mdXRpbFwiXG5pbXBvcnQgeyByZWFkRmlsZXMgfSBmcm9tIFwiLi9icm93c2VyLWZzLWFjY2Vzc1wiXG5pbXBvcnQgeyBwYXRoRnJvbUlkLCBpc1RlbXBsYXRlSWQsIGJ1aWxkVHJlZSwgVHJlZSB9IGZyb20gXCIuL3RyZWVcIlxuXG4vLyBsZXQgZm9vID0gbmV3IEludGwuTGlzdEZvcm1hdChcImVuXCIsIHsgc3R5bGU6IFwibG9uZ1wiLCB0eXBlOiBcImNvbmp1bmN0aW9uXCIgfSlcblxubGV0IG1ha2VWYXJpYW50ID0gKGNvbG9yKSA9PiAoe1xuICBiZzogYCR7Y29sb3J9LjEwMGAsXG4gIGJvcmRlclJpZ2h0OiBcIjNweCBzb2xpZFwiLFxuICBib3JkZXJMZWZ0OiBcIjNweCBzb2xpZFwiLFxuICBib3JkZXJDb2xvcjogYCR7Y29sb3J9LjQwMGAsXG59KVxuXG5sZXQgZGVmYXVsdFJlbmRlclRva2VuID0gKHByb3BzKSA9PiA8c3BhbiB7Li4ucHJvcHN9IC8+XG5cbmxldCBSZW5kZXJUZW1wbGF0ZSA9ICh7XG4gIHN0b3JlLFxuICB0cmVlLFxuICBzeCxcbiAgcmVuZGVyVG9rZW4gPSBkZWZhdWx0UmVuZGVyVG9rZW4sXG4gIC4uLnByb3BzXG59KSA9PiAoXG4gIDxCb3hcbiAgICBhcz1cInNwYW5cIlxuICAgIHN4PXt7XG4gICAgICB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXG4gICAgICBcIltkYXRhLWlkXVwiOiB7IGN1cnNvcjogXCJwb2ludGVyXCIsIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIiB9LFxuICAgICAgXCIudmFyaWFudDBcIjogbWFrZVZhcmlhbnQoXCJncmVlblwiKSxcbiAgICAgIFwiLnZhcmlhbnQxXCI6IG1ha2VWYXJpYW50KFwidGVhbFwiKSxcbiAgICAgIFwiLnZhcmlhbnQyXCI6IG1ha2VWYXJpYW50KFwiYmx1ZVwiKSxcbiAgICAgIFwiLnZhcmlhbnQzXCI6IG1ha2VWYXJpYW50KFwiY3lhblwiKSxcbiAgICAgIFwiLnZhcmlhbnQ0XCI6IG1ha2VWYXJpYW50KFwicHVycGxlXCIpLFxuICAgICAgLi4uc3gsXG4gICAgfX1cbiAgICB7Li4ucHJvcHN9XG4gID5cbiAgICB7VHJlZS5tYXAoXy5pZGVudGl0eSwgKG5vZGUsIGksIHBhcmVudHMpID0+IHtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG5vZGUpKSByZXR1cm4gbm9kZVxuXG4gICAgICBpZiAoIXN0b3JlLmdldFBhcnNlZEZpbGUobm9kZS5pZCkpXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEJveFxuICAgICAgICAgICAgYXM9XCJzcGFuXCJcbiAgICAgICAgICAgIGtleT17bm9kZS5pZH1cbiAgICAgICAgICAgIGJnPVwiZ3JheS4xMDBcIlxuICAgICAgICAgICAgdGV4dERlY29yYXRpb249XCJsaW5lLXRocm91Z2hcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtwYXRoRnJvbUlkKG5vZGUuaWQpfVxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApXG5cbiAgICAgIGlmIChpc1RlbXBsYXRlSWQobm9kZS5pZCkgJiYgIV8uaXNFbXB0eShub2RlLmNoaWxkcmVuKSlcbiAgICAgICAgcmV0dXJuIDxSZWFjdC5GcmFnbWVudCBrZXk9e25vZGUuaWR9Pntub2RlLmNoaWxkcmVufTwvUmVhY3QuRnJhZ21lbnQ+XG5cbiAgICAgIGxldCBkZXB0aCA9IF8uZmlsdGVyKCh4KSA9PiAhaXNUZW1wbGF0ZUlkKHguaWQpLCBwYXJlbnRzKS5sZW5ndGhcblxuICAgICAgcmV0dXJuIHJlbmRlclRva2VuKHtcbiAgICAgICAga2V5OiBub2RlLmlkLFxuICAgICAgICBbXCJkYXRhLWlkXCJdOiBub2RlLmlkLFxuICAgICAgICBjbGFzc05hbWU6IGB2YXJpYW50JHtkZXB0aCAlIDV9YCxcbiAgICAgICAgY2hpbGRyZW46IF8uaXNFbXB0eShub2RlLmNoaWxkcmVuKVxuICAgICAgICAgID8gcGF0aEZyb21JZChub2RlLmlkKVxuICAgICAgICAgIDogbm9kZS5jaGlsZHJlbixcbiAgICAgIH0pXG4gICAgfSkodHJlZSl9XG4gIDwvQm94PlxuKVxuXG5sZXQgTXVsdGlwbGVWYWx1ZVBpY2tlciA9ICh7IG9wdGlvbnMsIGNoaWxkcmVuLCAuLi5wcm9wcyB9KSA9PiAoXG4gIDxDaGVja2JveEdyb3VwIHsuLi5wcm9wc30+XG4gICAgPFN0YWNrPlxuICAgICAge18ubWFwKFxuICAgICAgICAob3B0aW9uKSA9PiAoXG4gICAgICAgICAgPENoZWNrYm94IGtleT17b3B0aW9ufSB2YWx1ZT17b3B0aW9ufT5cbiAgICAgICAgICAgIHtjaGlsZHJlbihvcHRpb24pfVxuICAgICAgICAgIDwvQ2hlY2tib3g+XG4gICAgICAgICksXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICApfVxuICAgIDwvU3RhY2s+XG4gIDwvQ2hlY2tib3hHcm91cD5cbilcblxubGV0IEV4Y2x1c2l2ZVZhbHVlUGlja2VyID0gKHsgb3B0aW9ucywgY2hpbGRyZW4sIC4uLnByb3BzIH0pID0+IChcbiAgPFJhZGlvR3JvdXAgey4uLnByb3BzfT5cbiAgICA8U3RhY2s+XG4gICAgICB7Xy5tYXAoXG4gICAgICAgIChvcHRpb24pID0+IChcbiAgICAgICAgICA8UmFkaW8ga2V5PXtvcHRpb259IHZhbHVlPXtvcHRpb259PlxuICAgICAgICAgICAge2NoaWxkcmVuKG9wdGlvbil9XG4gICAgICAgICAgPC9SYWRpbz5cbiAgICAgICAgKSxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgPC9SYWRpb0dyb3VwPlxuKVxuXG5sZXQgRW1wdHlWYWx1ZVBpY2tlciA9ICgpID0+IG51bGxcblxubGV0IFZhbHVlUGlja2VyID0gb2JzZXJ2ZXIoKHsgc3RvcmUsIC4uLnByb3BzIH0pID0+IHtcbiAgbGV0IHsgdHlwZSA9IFwiZGVmYXVsdFwiLCBvcHRpb25zID0gW10gfSA9IHN0b3JlLmdldFBhcnNlZEZpbGUoc3RvcmUuaWQpIHx8IHt9XG4gIGxldCBDb21wb25lbnQgPSB7XG4gICAgZXhjbHVzaXZlOiBFeGNsdXNpdmVWYWx1ZVBpY2tlcixcbiAgICBtdWx0aXBsZTogTXVsdGlwbGVWYWx1ZVBpY2tlcixcbiAgICBkZWZhdWx0OiBFbXB0eVZhbHVlUGlja2VyLFxuICB9W3R5cGVdXG4gIHJldHVybiAoXG4gICAgPENvbXBvbmVudFxuICAgICAga2V5PXtzdG9yZS5pZH1cbiAgICAgIHNpemU9XCJzbVwiXG4gICAgICB2YWx1ZT17Zi53aGVuKF8uaXNBcnJheSwgXy50b0FycmF5KShzdG9yZS52YWx1ZXMuZ2V0KHN0b3JlLmlkKSl9XG4gICAgICBvbkNoYW5nZT17KHgpID0+IHN0b3JlLnZhbHVlcy5zZXQoc3RvcmUuaWQsIHgpfVxuICAgICAgb3B0aW9ucz17b3B0aW9uc31cbiAgICAgIHsuLi5wcm9wc31cbiAgICA+XG4gICAgICB7KG9wdGlvbikgPT4gKFxuICAgICAgICA8UmVuZGVyVGVtcGxhdGVcbiAgICAgICAgICBzdG9yZT17c3RvcmV9XG4gICAgICAgICAgdHJlZT17YnVpbGRUcmVlKGYuZ2V0SW4oeyBbYCR7c3RvcmUucGF0aH06MWBdOiBvcHRpb24gfSkpKHtcbiAgICAgICAgICAgIGlkOiBgJHtzdG9yZS5wYXRofToxYCxcbiAgICAgICAgICB9KX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC9Db21wb25lbnQ+XG4gIClcbn0pXG5cbmxldCBSZWxvYWRGaWxlcyA9ICh7IHN0b3JlIH0pID0+IChcbiAgPEJ1dHRvblxuICAgIHNpemU9XCJzbVwiXG4gICAgb25DbGljaz17YXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IGZpbGVzID0gYXdhaXQgcmVhZEZpbGVzKHtcbiAgICAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICAgICAgICBmaWx0ZXI6IG1hdGNoKC9cXC4oZmllbGR8dGVtcCkkLyksXG4gICAgICB9KVxuICAgICAgc3RvcmUuc2V0VGVtcGxhdGVzKGZpbGVzLmZpbHRlcigoeCkgPT4geC5uYW1lLmVuZHNXaXRoKFwiLnRlbXBcIikpKVxuICAgICAgc3RvcmUuc2V0RmllbGRzKGZpbGVzLmZpbHRlcigoeCkgPT4geC5uYW1lLmVuZHNXaXRoKFwiLmZpZWxkXCIpKSlcbiAgICB9fVxuICA+XG4gICAgUmVsb2FkIGZpbGVzXG4gIDwvQnV0dG9uPlxuKVxuXG5sZXQgTm90ZSA9IG9ic2VydmVyKCh7IHN0b3JlLCAuLi5wcm9wcyB9KSA9PiAoXG4gIDxSZW5kZXJUZW1wbGF0ZVxuICAgIHN0b3JlPXtzdG9yZX1cbiAgICB0cmVlPXtidWlsZFRyZWUoc3RvcmUuZ2V0VmFsdWUpKHsgaWQ6IGAke3N0b3JlLnBhdGh9OjFgIH0pfVxuICAgIHJlbmRlclRva2VuPXsocHJvcHMpID0+IChcbiAgICAgIDxhXG4gICAgICAgIGhyZWY9XCIjXCJcbiAgICAgICAgb25DbGljaz17KGUpID0+IHN0b3JlLnBhdGhzLnNldChzdG9yZS5wYXRoLCBlLnRhcmdldC5kYXRhc2V0LmlkKX1cbiAgICAgICAgey4uLnByb3BzfVxuICAgICAgLz5cbiAgICApfVxuICAgIHsuLi5wcm9wc31cbiAgLz5cbikpXG5cbmxldCBGaWxlUGlja2VyID0gKHsgc3RvcmUgfSkgPT4gKFxuICA8U3RhY2s+XG4gICAge18ubWFwKFxuICAgICAgKHBhdGgpID0+IChcbiAgICAgICAgPEJveCBrZXk9e3BhdGh9PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJsaW5rXCJcbiAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICBjb2xvclNjaGVtZT1cImJsYWNrXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IChzdG9yZS5wYXRoID0gcGF0aCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3BhdGh9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgKSxcbiAgICAgIF8ua2V5cyh7IC4uLnN0b3JlLnRlbXBsYXRlcywgLi4uc3RvcmUuZmllbGRzIH0pLFxuICAgICl9XG4gIDwvU3RhY2s+XG4pXG5cbmxldCBBcHAgPSAoeyBzdG9yZSB9KSA9PiAoXG4gIDxGbGV4XG4gICAgdz1cIjEwMHZ3XCJcbiAgICBoPVwiMTAwdmhcIlxuICAgIGZvbnRGYW1pbHk9XCJtb25vc3BhY2VcIlxuICAgIHN4PXt7XG4gICAgICBcIj4gKjpub3QoaHIpXCI6IHsgcDogMywgaDogXCIxMDAlXCIsIG92ZXJmbG93OiBcInNjcm9sbFwiIH0sXG4gICAgfX1cbiAgPlxuICAgIDxTdGFjayBmbGV4QmFzaXM9XCIyMCVcIj5cbiAgICAgIDxSZWxvYWRGaWxlcyBzdG9yZT17c3RvcmV9IC8+XG4gICAgICA8RmlsZVBpY2tlciBzdG9yZT17c3RvcmV9IGZsZXg9ezF9IC8+XG4gICAgPC9TdGFjaz5cbiAgICA8Tm90ZSBzdG9yZT17c3RvcmV9IGZsZXhCYXNpcz1cIjQwJVwiIC8+XG4gICAgPEJveCBmbGV4QmFzaXM9XCI0MCVcIj5cbiAgICAgIDxWYWx1ZVBpY2tlciBzdG9yZT17c3RvcmV9IHc9XCIxMDAlXCIgLz5cbiAgICA8L0JveD5cbiAgPC9GbGV4PlxuKVxuXG5leHBvcnQgZGVmYXVsdCBBcHBcbiIsImltcG9ydCBfIGZyb20gXCJsb2Rhc2gvZnBcIlxuaW1wb3J0IHsgdHlwZXMgfSBmcm9tIFwibW9ieC1zdGF0ZS10cmVlXCJcbmltcG9ydCBwYXRoIGZyb20gXCIuL3BhdGhcIlxuaW1wb3J0IHsgaXNUZW1wbGF0ZUlkLCBwYXRoRnJvbUlkIH0gZnJvbSBcIi4vdHJlZVwiXG5cbmxldCBwYXJzZUZpZWxkID0gKHRleHQpID0+IHtcbiAgbGV0IFt0eXBlLCAuLi5vcHRpb25zXSA9IF8ubWFwKFxuICAgICh4KSA9PiBfLnRyaW0oeCwgXCJcXG5cIiksXG4gICAgXy5zcGxpdCgvXFxuXFxzKi1cXHMqXFxuLywgdGV4dCksXG4gIClcbiAgcmV0dXJuIHsgdHlwZSwgb3B0aW9ucyB9XG59XG5cbmxldCBwYXJzZUZpbGVzID0gKHBhcnNlKSA9PlxuICBfLmZsb3coXG4gICAgXy5rZXlCeSgoZmlsZSkgPT4gcGF0aC5kcm9wZGlycygxLCBwYXRoLmFicyhmaWxlLndlYmtpdFJlbGF0aXZlUGF0aCkpKSxcbiAgICBfLm1hcFZhbHVlcygoeCkgPT4gcGFyc2UoeC5kYXRhKSksXG4gIClcblxubGV0IEZpZWxkID0gdHlwZXMubW9kZWwoe1xuICB0eXBlOiB0eXBlcy5lbnVtZXJhdGlvbihbXCJleGNsdXNpdmVcIiwgXCJtdWx0aXBsZVwiXSksXG4gIG9wdGlvbnM6IHR5cGVzLmFycmF5KHR5cGVzLnN0cmluZyksXG59KVxuXG5leHBvcnQgZGVmYXVsdCB0eXBlc1xuICAubW9kZWwoe1xuICAgIHBhdGg6IHR5cGVzLm1heWJlKHR5cGVzLnN0cmluZyksXG4gICAgcGF0aHM6IHR5cGVzLm1hcCh0eXBlcy5zdHJpbmcpLFxuICAgIHZhbHVlczogdHlwZXMubWFwKHR5cGVzLnVuaW9uKHR5cGVzLnN0cmluZywgdHlwZXMuYXJyYXkodHlwZXMuc3RyaW5nKSkpLFxuICAgIC8vIFJlYWQgZnJvbSBmaWxlc3lzdGVtXG4gICAgdGVtcGxhdGVzOiB0eXBlcy5vcHRpb25hbCh0eXBlcy5mcm96ZW4odHlwZXMubWFwKHR5cGVzLnN0cmluZykpLCB7fSksXG4gICAgZmllbGRzOiB0eXBlcy5vcHRpb25hbCh0eXBlcy5mcm96ZW4odHlwZXMubWFwKEZpZWxkKSksIHt9KSxcbiAgfSlcbiAgLnZpZXdzKChzZWxmKSA9PiAoe1xuICAgIGdldCBpZCgpIHtcbiAgICAgIHJldHVybiBzZWxmLnBhdGhzLmdldChzZWxmLnBhdGgpXG4gICAgfSxcbiAgICBnZXRWYWx1ZShpZCkge1xuICAgICAgcmV0dXJuIGlzVGVtcGxhdGVJZChpZClcbiAgICAgICAgPyBzZWxmLnRlbXBsYXRlc1twYXRoRnJvbUlkKGlkKV1cbiAgICAgICAgOiBzZWxmLnZhbHVlcy5nZXQoaWQpXG4gICAgfSxcbiAgICBnZXRQYXJzZWRGaWxlKGlkKSB7XG4gICAgICByZXR1cm4gaXNUZW1wbGF0ZUlkKGlkKVxuICAgICAgICA/IHNlbGYudGVtcGxhdGVzW3BhdGhGcm9tSWQoaWQpXVxuICAgICAgICA6IHNlbGYuZmllbGRzW3BhdGhGcm9tSWQoaWQpXVxuICAgIH0sXG4gIH0pKVxuICAuYWN0aW9ucygoc2VsZikgPT4gKHtcbiAgICBzZXRUZW1wbGF0ZXMoZmlsZXMpIHtcbiAgICAgIHNlbGYudGVtcGxhdGVzID0gcGFyc2VGaWxlcyhfLnJlcGxhY2UoL1xcbiokLywgXCJcIikpKGZpbGVzKVxuICAgIH0sXG4gICAgc2V0RmllbGRzKGZpbGVzKSB7XG4gICAgICBzZWxmLmZpZWxkcyA9IHBhcnNlRmlsZXMocGFyc2VGaWVsZCkoZmlsZXMpXG4gICAgfSxcbiAgfSkpXG4iLCJpbXBvcnQgXyBmcm9tIFwibG9kYXNoL2ZwXCJcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IHsgY29uZmlndXJlIH0gZnJvbSBcIm1vYnhcIlxuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIlxuaW1wb3J0IHsgQ2hha3JhUHJvdmlkZXIsIGV4dGVuZFRoZW1lIH0gZnJvbSBcIkBjaGFrcmEtdWkvcmVhY3RcIlxuaW1wb3J0IHsgb25TbmFwc2hvdCwgZ2V0U25hcHNob3QsIHVucHJvdGVjdCB9IGZyb20gXCJtb2J4LXN0YXRlLXRyZWVcIlxuaW1wb3J0IEFwcCBmcm9tIFwiLi9BcHBcIlxuaW1wb3J0IG1vZGVsIGZyb20gXCIuL21vZGVsXCJcblxuY29uZmlndXJlKHsgZW5mb3JjZUFjdGlvbnM6IFwibmV2ZXJcIiB9KVxuXG5sZXQgc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VcblxubGV0IHN0b3JlID0gbW9kZWwuY3JlYXRlKEpTT04ucGFyc2Uoc3RvcmFnZS5nZXRJdGVtKFwic3RvcmVcIikpIHx8IHVuZGVmaW5lZClcblxudW5wcm90ZWN0KHN0b3JlKVxuXG5vblNuYXBzaG90KHN0b3JlLCAoeCkgPT4gc3RvcmFnZS5zZXRJdGVtKFwic3RvcmVcIiwgSlNPTi5zdHJpbmdpZnkoeCkpKVxuXG5SZWFjdERPTS5yZW5kZXIoXG4gIDxSZWFjdC5TdHJpY3RNb2RlPlxuICAgIDxDaGFrcmFQcm92aWRlcj5cbiAgICAgIDxBcHAgc3RvcmU9e3N0b3JlfSAvPlxuICAgIDwvQ2hha3JhUHJvdmlkZXI+XG4gIDwvUmVhY3QuU3RyaWN0TW9kZT4sXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSxcbilcbiJdLCJuYW1lcyI6WyJwYXRoIiwiXyIsImJ1aWxkVHJlZSIsImRpcmVjdG9yeU9wZW4iLCJtYWtlVmFyaWFudCIsImNvbG9yIiwiYmciLCJib3JkZXJSaWdodCIsImJvcmRlckxlZnQiLCJib3JkZXJDb2xvciIsImRlZmF1bHRSZW5kZXJUb2tlbiIsInByb3BzIiwiUmVuZGVyVGVtcGxhdGUiLCJzdG9yZSIsInRyZWUiLCJzeCIsInJlbmRlclRva2VuIiwid2hpdGVTcGFjZSIsImN1cnNvciIsInRleHREZWNvcmF0aW9uIiwiVHJlZSIsIm1hcCIsImlkZW50aXR5Iiwibm9kZSIsImkiLCJwYXJlbnRzIiwiaXNTdHJpbmciLCJnZXRQYXJzZWRGaWxlIiwiaWQiLCJwYXRoRnJvbUlkIiwiaXNUZW1wbGF0ZUlkIiwiaXNFbXB0eSIsImNoaWxkcmVuIiwiZGVwdGgiLCJmaWx0ZXIiLCJ4IiwibGVuZ3RoIiwia2V5IiwiY2xhc3NOYW1lIiwiTXVsdGlwbGVWYWx1ZVBpY2tlciIsIm9wdGlvbnMiLCJvcHRpb24iLCJFeGNsdXNpdmVWYWx1ZVBpY2tlciIsIkVtcHR5VmFsdWVQaWNrZXIiLCJWYWx1ZVBpY2tlciIsIm9ic2VydmVyIiwidHlwZSIsIkNvbXBvbmVudCIsImV4Y2x1c2l2ZSIsIm11bHRpcGxlIiwiZGVmYXVsdCIsImYiLCJ3aGVuIiwiaXNBcnJheSIsInRvQXJyYXkiLCJ2YWx1ZXMiLCJnZXQiLCJzZXQiLCJnZXRJbiIsIlJlbG9hZEZpbGVzIiwiZmlsZXMiLCJyZWFkRmlsZXMiLCJyZWN1cnNpdmUiLCJtYXRjaCIsInNldFRlbXBsYXRlcyIsIm5hbWUiLCJlbmRzV2l0aCIsInNldEZpZWxkcyIsIk5vdGUiLCJnZXRWYWx1ZSIsImUiLCJwYXRocyIsInRhcmdldCIsImRhdGFzZXQiLCJGaWxlUGlja2VyIiwia2V5cyIsInRlbXBsYXRlcyIsImZpZWxkcyIsIkFwcCIsInAiLCJoIiwib3ZlcmZsb3ciLCJjb25maWd1cmUiLCJlbmZvcmNlQWN0aW9ucyIsInN0b3JhZ2UiLCJ3aW5kb3ciLCJsb2NhbFN0b3JhZ2UiLCJtb2RlbCIsImNyZWF0ZSIsIkpTT04iLCJwYXJzZSIsImdldEl0ZW0iLCJ1bmRlZmluZWQiLCJ1bnByb3RlY3QiLCJvblNuYXBzaG90Iiwic2V0SXRlbSIsInN0cmluZ2lmeSIsIlJlYWN0RE9NIiwicmVuZGVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLElBQUksb0JBQW9CO0FBQzFCLFFBQU0sVUFBVSxTQUFTLGNBQWMsUUFBUTtBQUMvQyxNQUFJLFdBQVcsUUFBUSxZQUFZLFFBQVEsU0FBUyxrQkFBa0I7QUFDbEU7QUFBQTtBQUVKLGFBQVcsUUFBUSxTQUFTLGlCQUFpQiw4QkFBOEI7QUFDdkUsbUJBQWU7QUFBQTtBQUVuQixNQUFJLGlCQUFpQixDQUFDLGNBQWM7QUFDaEMsZUFBVyxZQUFZLFdBQVc7QUFDOUIsVUFBSSxTQUFTLFNBQVMsYUFBYTtBQUMvQjtBQUFBO0FBRUosaUJBQVcsUUFB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
