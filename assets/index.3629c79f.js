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
import { f as fp, p as pathBrowserify, a as f, W, o as observer, j as jsx, b as jsxs, G as Grid, B as Box, R as React, S as Stack, c as Button, s as striptags, F as Flex, C as CheckboxGroup, d as Checkbox, e as RadioGroup, g as Radio, t as types, h as configure, u as unprotect, i as onSnapshot, k as ReactDOM, l as ChakraProvider } from "./vendor.303afe0c.js";
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
let Note = observer((_k) => {
  var _l = _k, {
    store: store2
  } = _l, props = __objRest(_l, [
    "store"
  ]);
  return /* @__PURE__ */ jsx(RenderTemplate, {
    id: "note",
    store: store2,
    tree: buildTree(store2.getValue)({
      id: `${store2.path}:1`
    }),
    renderToken: (props2) => /* @__PURE__ */ jsx("a", __spreadValues({
      href: "#",
      onClick: (e) => store2.paths.set(store2.path, e.target.dataset.id)
    }, props2))
  });
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
let ReloadFilesButton = (_m) => {
  var _n = _m, {
    store: store2
  } = _n, props = __objRest(_n, [
    "store"
  ]);
  return /* @__PURE__ */ jsx(Button, __spreadProps(__spreadValues({
    onClick: async () => {
      let files = await readFiles({
        recursive: true,
        filter: match(/\.(field|temp)$/)
      });
      store2.setTemplates(files.filter((x) => x.name.endsWith(".temp")));
      store2.setFields(files.filter((x) => x.name.endsWith(".field")));
    }
  }, props), {
    children: "Reload files"
  }));
};
let CopyNoteButton = (props) => /* @__PURE__ */ jsx(Button, __spreadProps(__spreadValues({
  onClick: () => navigator.clipboard.writeText(striptags(document.getElementById("note").innerHTML))
}, props), {
  children: "Copy Note"
}));
let Section = (_o) => {
  var _p = _o, {
    header,
    children,
    Title
  } = _p, props = __objRest(_p, [
    "header",
    "children",
    "Title"
  ]);
  return /* @__PURE__ */ jsxs(Stack, __spreadProps(__spreadValues({
    bg: "white",
    borderRadius: "md",
    boxShadow: "md",
    spacing: "0"
  }, props), {
    children: [/* @__PURE__ */ jsxs(Flex, {
      bg: "red.200",
      p: "2",
      justifyContent: "space-between",
      pos: "sticky",
      top: "0",
      children: [/* @__PURE__ */ jsx(Title, {}), header]
    }), /* @__PURE__ */ jsx(Box, {
      p: "3",
      children
    })]
  }));
};
let noteTitle = (store2) => observer(() => /* @__PURE__ */ jsx("b", {
  children: store2.path || "<- Pick file"
}));
let valuePickerTitle = (store2) => observer(() => /* @__PURE__ */ jsx("b", {
  children: pathFromId(store2.id) || "<- Pick field"
}));
let App = ({
  store: store2
}) => /* @__PURE__ */ jsxs(Grid, {
  w: "100vw",
  h: "100vh",
  p: "2",
  gap: "2",
  bg: "gray.100",
  fontFamily: "monospace",
  fontSize: "sm",
  gridTemplate: `
      "file-picker note value-picker" 100%
      / 20% 40% 40%
    `,
  sx: {
    "> *": {
      overflow: "scroll"
    }
  },
  children: [/* @__PURE__ */ jsx(Section, {
    Title: () => /* @__PURE__ */ jsx("b", {
      children: "Files"
    }),
    header: /* @__PURE__ */ jsx(ReloadFilesButton, {
      size: "xs",
      colorScheme: "red",
      store: store2
    }),
    children: /* @__PURE__ */ jsx(FilePicker, {
      store: store2,
      gridArea: "file-picker"
    })
  }), /* @__PURE__ */ jsx(Section, {
    Title: noteTitle(store2),
    header: /* @__PURE__ */ jsx(CopyNoteButton, {
      size: "xs",
      colorScheme: "red"
    }),
    children: /* @__PURE__ */ jsx(Note, {
      store: store2,
      gridArea: "note"
    })
  }), /* @__PURE__ */ jsx(Section, {
    Title: valuePickerTitle(store2),
    children: /* @__PURE__ */ jsx(ValuePicker, {
      store: store2,
      gridArea: "value-picker"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguMzYyOWM3OWYuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3ZpdGUvbW9kdWxlcHJlbG9hZC1wb2x5ZmlsbCIsIi4uLy4uL3NyYy9wYXRoLmpzIiwiLi4vLi4vc3JjL2Z1dGlsLmpzIiwiLi4vLi4vc3JjL2Jyb3dzZXItZnMtYWNjZXNzLmpzIiwiLi4vLi4vc3JjL3RyZWUuanMiLCIuLi8uLi9zcmMvQXBwLmpzeCIsIi4uLy4uL3NyYy9tb2RlbC5qcyIsIi4uLy4uL3NyYy9pbmRleC5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcCA9IGZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICAgIGNvbnN0IHJlbExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJykucmVsTGlzdDtcbiAgICBpZiAocmVsTGlzdCAmJiByZWxMaXN0LnN1cHBvcnRzICYmIHJlbExpc3Quc3VwcG9ydHMoJ21vZHVsZXByZWxvYWQnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgbGluayBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cIm1vZHVsZXByZWxvYWRcIl0nKSkge1xuICAgICAgICBwcm9jZXNzUHJlbG9hZChsaW5rKTtcbiAgICB9XG4gICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xuICAgICAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgIT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgbXV0YXRpb24uYWRkZWROb2Rlcykge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnRhZ05hbWUgPT09ICdMSU5LJyAmJiBub2RlLnJlbCA9PT0gJ21vZHVsZXByZWxvYWQnKVxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzUHJlbG9hZChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pLm9ic2VydmUoZG9jdW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuICAgIGZ1bmN0aW9uIGdldEZldGNoT3B0cyhzY3JpcHQpIHtcbiAgICAgICAgY29uc3QgZmV0Y2hPcHRzID0ge307XG4gICAgICAgIGlmIChzY3JpcHQuaW50ZWdyaXR5KVxuICAgICAgICAgICAgZmV0Y2hPcHRzLmludGVncml0eSA9IHNjcmlwdC5pbnRlZ3JpdHk7XG4gICAgICAgIGlmIChzY3JpcHQucmVmZXJyZXJwb2xpY3kpXG4gICAgICAgICAgICBmZXRjaE9wdHMucmVmZXJyZXJQb2xpY3kgPSBzY3JpcHQucmVmZXJyZXJwb2xpY3k7XG4gICAgICAgIGlmIChzY3JpcHQuY3Jvc3NvcmlnaW4gPT09ICd1c2UtY3JlZGVudGlhbHMnKVxuICAgICAgICAgICAgZmV0Y2hPcHRzLmNyZWRlbnRpYWxzID0gJ2luY2x1ZGUnO1xuICAgICAgICBlbHNlIGlmIChzY3JpcHQuY3Jvc3NvcmlnaW4gPT09ICdhbm9ueW1vdXMnKVxuICAgICAgICAgICAgZmV0Y2hPcHRzLmNyZWRlbnRpYWxzID0gJ29taXQnO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmZXRjaE9wdHMuY3JlZGVudGlhbHMgPSAnc2FtZS1vcmlnaW4nO1xuICAgICAgICByZXR1cm4gZmV0Y2hPcHRzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwcm9jZXNzUHJlbG9hZChsaW5rKSB7XG4gICAgICAgIGlmIChsaW5rLmVwKVxuICAgICAgICAgICAgLy8gZXAgbWFya2VyID0gcHJvY2Vzc2VkXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGxpbmsuZXAgPSB0cnVlO1xuICAgICAgICAvLyBwcmVwb3B1bGF0ZSB0aGUgbG9hZCByZWNvcmRcbiAgICAgICAgY29uc3QgZmV0Y2hPcHRzID0gZ2V0RmV0Y2hPcHRzKGxpbmspO1xuICAgICAgICBmZXRjaChsaW5rLmhyZWYsIGZldGNoT3B0cyk7XG4gICAgfVxufTtfX1ZJVEVfSVNfTU9ERVJOX18mJnAoKTsiLCJpbXBvcnQgXyBmcm9tIFwibG9kYXNoL2ZwXCJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoLWJyb3dzZXJpZnlcIlxuXG5sZXQgYWJzID0gKHgpID0+IHBhdGgucmVzb2x2ZShcIi9cIiwgeClcblxubGV0IGRlbGltam9pbiA9ICguLi5hcmdzKSA9PiBfLmpvaW4ocGF0aC5kZWxpbWl0ZXIsIF8uY29tcGFjdChhcmdzKSlcblxubGV0IGRlbGltc3BsaXQgPSBfLnNwbGl0KHBhdGguZGVsaW1pdGVyKVxuXG5sZXQgZHJvcGRpcnMgPSAobiwgeCkgPT4ge1xuICBsZXQgW2ZpcnN0LCAuLi5yZXN0XSA9IF8uc3BsaXQocGF0aC5zZXAsIHgpXG4gIHJldHVybiBfLmpvaW4oXG4gICAgcGF0aC5zZXAsXG4gICAgZmlyc3QgPT09IFwiXCIgPyBbZmlyc3QsIC4uLl8uZHJvcChuLCByZXN0KV0gOiBfLmRyb3AobiwgW2ZpcnN0LCAuLi5yZXN0XSksXG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgeyAuLi5wYXRoLCBhYnMsIGRlbGltam9pbiwgZGVsaW1zcGxpdCwgZHJvcGRpcnMgfVxuIiwiaW1wb3J0IGYgZnJvbSBcImZ1dGlsXCJcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2gvZnBcIlxuXG5leHBvcnQgbGV0IG1hdGNoID0gXy5jdXJyeSgocGF0dGVybiwgc3RyKSA9PiBzdHI/Lm1hdGNoKHBhdHRlcm4pKVxuXG5sZXQgd3JpdGVQcm9wZXJ0eSA9XG4gIChuZXh0ID0gdHJhdmVyc2UpID0+XG4gIChub2RlLCBpbmRleCwgW3BhcmVudF0pID0+IHtcbiAgICBpZiAocGFyZW50KSBmLnNldE9uKGluZGV4LCBub2RlLCBuZXh0KHBhcmVudCkpXG4gIH1cblxubGV0IHRyYW5zZm9ybVRyZWUgPVxuICAobmV4dCA9IGYudHJhdmVyc2UpID0+XG4gICguLi5hcmdzKSA9PlxuICAodHJlZSkgPT4ge1xuICAgIGxldCByZXN1bHQgPSBfLmNsb25lRGVlcCh0cmVlKVxuICAgIGYud2FsayhuZXh0KSguLi5hcmdzKShyZXN1bHQpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbmxldCBtYXBUcmVlID1cbiAgKG5leHQgPSBmLnRyYXZlcnNlLCB3cml0ZU5vZGUgPSB3cml0ZVByb3BlcnR5KG5leHQpKSA9PlxuICAocHJlLCBwb3N0ID0gXy5pZGVudGl0eSwgLi4uYXJncykgPT4ge1xuICAgIGxldCB3cml0ZSA9XG4gICAgICAoZm4pID0+XG4gICAgICAobm9kZSwgLi4uYXJncykgPT4ge1xuICAgICAgICB3cml0ZU5vZGUoZm4obm9kZSwgLi4uYXJncyksIC4uLmFyZ3MpXG4gICAgICB9XG4gICAgcmV0dXJuIF8uZmxvdyhcbiAgICAgIHByZSxcbiAgICAgIHRyYW5zZm9ybVRyZWUobmV4dCkod3JpdGUocHJlKSwgd3JpdGUocG9zdCksIC4uLmFyZ3MpLFxuICAgICAgcG9zdCxcbiAgICApXG4gIH1cblxubGV0IGJ1aWxkVHJlZSA9XG4gIChuZXh0ID0gZi50cmF2ZXJzZSwgd3JpdGVOb2RlID0gd3JpdGVQcm9wZXJ0eShuZXh0KSkgPT5cbiAgKGdlbmVyYXRlTmV4dCkgPT5cbiAgICB0cmFuc2Zvcm1UcmVlKGdlbmVyYXRlTmV4dCkod3JpdGVOb2RlKVxuXG5leHBvcnQgbGV0IHRyZWUgPSAoXG4gIG5leHQgPSB0cmF2ZXJzZSxcbiAgYnVpbGRJdGVyYXRlZSA9IF8uaWRlbnRpdHksXG4gIHdyaXRlTm9kZSA9IHdyaXRlUHJvcGVydHkobmV4dCksXG4pID0+ICh7XG4gIHdhbGs6IGYud2FsayhuZXh0KSxcbiAgd2Fsa0FzeW5jOiBmLndhbGtBc3luYyhuZXh0KSxcbiAgdHJhbnNmb3JtOiB0cmFuc2Zvcm1UcmVlKG5leHQpLFxuICByZWR1Y2U6IGYucmVkdWNlVHJlZShuZXh0KSxcbiAgdG9BcnJheUJ5OiBmLnRyZWVUb0FycmF5QnkobmV4dCksXG4gIHRvQXJyYXk6IGYudHJlZVRvQXJyYXkobmV4dCksXG4gIGxlYXZlczogZi5sZWF2ZXMobmV4dCksXG4gIGxlYXZlc0J5OiBmLmxlYXZlc0J5KG5leHQpLFxuICBsb29rdXA6IGYudHJlZUxvb2t1cChuZXh0LCBidWlsZEl0ZXJhdGVlKSxcbiAga2V5QnlXaXRoOiBmLmtleVRyZWVCeVdpdGgobmV4dCksXG4gIHRyYXZlcnNlOiBuZXh0LFxuICBmbGF0dGVuOiBmLmZsYXR0ZW5UcmVlKG5leHQpLFxuICBmbGF0TGVhdmVzOiBmLmZsYXRMZWF2ZXMobmV4dCksXG4gIG1hcDogbWFwVHJlZShuZXh0LCB3cml0ZU5vZGUpLFxuICBtYXBMZWF2ZXM6IGYubWFwVHJlZUxlYXZlcyhuZXh0LCB3cml0ZU5vZGUpLFxuICBidWlsZDogYnVpbGRUcmVlKG5leHQsIHdyaXRlTm9kZSksXG59KVxuIiwiaW1wb3J0IHsgZGlyZWN0b3J5T3BlbiB9IGZyb20gXCJicm93c2VyLWZzLWFjY2Vzc1wiXG5cbmV4cG9ydCBsZXQgcmVhZEZpbGVzID0gYXN5bmMgKHsgZmlsdGVyLCAuLi5vcHRpb25zIH0pID0+IHtcbiAgbGV0IGZpbGVzID0gYXdhaXQgZGlyZWN0b3J5T3BlbihvcHRpb25zKVxuICBpZiAoZmlsdGVyKSBmaWxlcyA9IGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsdGVyKGZpbGUubmFtZSkpXG4gIGxldCBwcm9taXNlcyA9IGZpbGVzLm1hcChhc3luYyAoZmlsZSkgPT4ge1xuICAgIGZpbGUuZGF0YSA9IG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShhd2FpdCBmaWxlLmFycmF5QnVmZmVyKCkpXG4gIH0pXG4gIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKVxuICByZXR1cm4gZmlsZXNcbn1cbiIsImltcG9ydCBfIGZyb20gXCJsb2Rhc2gvZnBcIlxuaW1wb3J0IGYgZnJvbSBcImZ1dGlsXCJcbmltcG9ydCBwYXRoIGZyb20gXCIuL3BhdGhcIlxuaW1wb3J0IHsgdHJlZSwgbWF0Y2ggfSBmcm9tIFwiLi9mdXRpbFwiXG5cbmV4cG9ydCBsZXQgaXNUZW1wbGF0ZUlkID0gXy5mbG93KG1hdGNoKC9cXC50ZW1wOlxcZCskLykpXG5cbmV4cG9ydCBsZXQgcGF0aEZyb21JZCA9IF8uZmxvdyhwYXRoLmRlbGltc3BsaXQsIF8ubnRoKC0yKSlcblxuZXhwb3J0IGxldCBUcmVlID0gdHJlZShcbiAgXy5nZXQoXCJjaGlsZHJlblwiKSxcbiAgXy5pZGVudGl0eSxcbiAgKG5vZGUsIGluZGV4LCBbcGFyZW50XSkgPT4ge1xuICAgIGYuc2V0T24oW1wiY2hpbGRyZW5cIiwgaW5kZXhdLCBub2RlLCBwYXJlbnQpXG4gIH0sXG4pXG5cbmxldCB0b2tlbml6ZSA9IF8uZmxvdyhfLnNwbGl0KC8oe3suKz99fSkvKSwgXy5jb21wYWN0KVxuXG5leHBvcnQgbGV0IGJ1aWxkVHJlZSA9IChnZXRWYWx1ZSkgPT4ge1xuICBsZXQgZ2V0UGF0aCA9ICh0b2tlbikgPT4gXy5udGgoMSwgdG9rZW4ubWF0Y2goL157e1xccyooLiopXFxzKn19JC8pKVxuXG4gIGxldCBjYWNoZSA9IHt9XG5cbiAgbGV0IGdlbklkID0gKHBhcmVudCwgdG9rZW5QYXRoKSA9PiB7XG4gICAgbGV0IGZ1bGxwYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShwYXRoRnJvbUlkKHBhcmVudC5pZCkpLCB0b2tlblBhdGgpXG4gICAgbGV0IGtleSA9IHBhdGguZGVsaW1qb2luKHBhcmVudC5pZCwgZnVsbHBhdGgpXG4gICAgY2FjaGVba2V5XSA9IF8uYWRkKGNhY2hlW2tleV0sIDEpXG4gICAgcmV0dXJuIHBhdGguZGVsaW1qb2luKGtleSwgY2FjaGVba2V5XSlcbiAgfVxuXG4gIHJldHVybiBUcmVlLmJ1aWxkKChub2RlKSA9PlxuICAgIF8ubWFwKFxuICAgICAgZi53aGVuKGdldFBhdGgsICh4KSA9PiAoeyBpZDogZ2VuSWQobm9kZSwgZ2V0UGF0aCh4KSkgfSkpLFxuICAgICAgdG9rZW5pemUoZ2V0VmFsdWUobm9kZS5pZCkpLFxuICAgICksXG4gIClcbn1cbiIsImltcG9ydCBfIGZyb20gXCJsb2Rhc2gvZnBcIlxuaW1wb3J0IGYgZnJvbSBcImZ1dGlsXCJcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IHN0cmlwdGFncyBmcm9tIFwic3RyaXB0YWdzXCJcbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3QtbGl0ZVwiXG5pbXBvcnQge1xuICBGbGV4LFxuICBCb3gsXG4gIEJ1dHRvbixcbiAgQ2VudGVyLFxuICBIZWFkaW5nLFxuICBDb2RlLFxuICBTdGFjayxcbiAgUmFkaW8sXG4gIEdyaWQsXG4gIFJhZGlvR3JvdXAsXG4gIENoZWNrYm94LFxuICBDaGVja2JveEdyb3VwLFxufSBmcm9tIFwiQGNoYWtyYS11aS9yZWFjdFwiXG5pbXBvcnQgcGF0aCBmcm9tIFwiLi9wYXRoXCJcbmltcG9ydCB7IG1hdGNoIH0gZnJvbSBcIi4vZnV0aWxcIlxuaW1wb3J0IHsgcmVhZEZpbGVzIH0gZnJvbSBcIi4vYnJvd3Nlci1mcy1hY2Nlc3NcIlxuaW1wb3J0IHsgcGF0aEZyb21JZCwgaXNUZW1wbGF0ZUlkLCBidWlsZFRyZWUsIFRyZWUgfSBmcm9tIFwiLi90cmVlXCJcblxuLy8gbGV0IGZvbyA9IG5ldyBJbnRsLkxpc3RGb3JtYXQoXCJlblwiLCB7IHN0eWxlOiBcImxvbmdcIiwgdHlwZTogXCJjb25qdW5jdGlvblwiIH0pXG5cbmxldCBtYWtlVmFyaWFudCA9IChjb2xvcikgPT4gKHtcbiAgYmc6IGAke2NvbG9yfS4xMDBgLFxuICBib3JkZXJSaWdodDogXCIzcHggc29saWRcIixcbiAgYm9yZGVyTGVmdDogXCIzcHggc29saWRcIixcbiAgYm9yZGVyQ29sb3I6IGAke2NvbG9yfS40MDBgLFxufSlcblxubGV0IGRlZmF1bHRSZW5kZXJUb2tlbiA9IChwcm9wcykgPT4gPHNwYW4gey4uLnByb3BzfSAvPlxuXG5sZXQgUmVuZGVyVGVtcGxhdGUgPSAoe1xuICBzdG9yZSxcbiAgdHJlZSxcbiAgc3gsXG4gIHJlbmRlclRva2VuID0gZGVmYXVsdFJlbmRlclRva2VuLFxuICAuLi5wcm9wc1xufSkgPT4gKFxuICA8Qm94XG4gICAgYXM9XCJzcGFuXCJcbiAgICBzeD17e1xuICAgICAgd2hpdGVTcGFjZTogXCJwcmUtd3JhcFwiLFxuICAgICAgXCJbZGF0YS1pZF1cIjogeyBjdXJzb3I6IFwicG9pbnRlclwiLCB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIgfSxcbiAgICAgIFwiLnZhcmlhbnQwXCI6IG1ha2VWYXJpYW50KFwiZ3JlZW5cIiksXG4gICAgICBcIi52YXJpYW50MVwiOiBtYWtlVmFyaWFudChcInRlYWxcIiksXG4gICAgICBcIi52YXJpYW50MlwiOiBtYWtlVmFyaWFudChcImJsdWVcIiksXG4gICAgICBcIi52YXJpYW50M1wiOiBtYWtlVmFyaWFudChcImN5YW5cIiksXG4gICAgICBcIi52YXJpYW50NFwiOiBtYWtlVmFyaWFudChcInB1cnBsZVwiKSxcbiAgICAgIC4uLnN4LFxuICAgIH19XG4gICAgey4uLnByb3BzfVxuICA+XG4gICAge1RyZWUubWFwKF8uaWRlbnRpdHksIChub2RlLCBpLCBwYXJlbnRzKSA9PiB7XG4gICAgICBpZiAoXy5pc1N0cmluZyhub2RlKSkgcmV0dXJuIG5vZGVcblxuICAgICAgaWYgKCFzdG9yZS5nZXRQYXJzZWRGaWxlKG5vZGUuaWQpKVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgIGFzPVwic3BhblwiXG4gICAgICAgICAgICBrZXk9e25vZGUuaWR9XG4gICAgICAgICAgICBiZz1cImdyYXkuMTAwXCJcbiAgICAgICAgICAgIHRleHREZWNvcmF0aW9uPVwibGluZS10aHJvdWdoXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7cGF0aEZyb21JZChub2RlLmlkKX1cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKVxuXG4gICAgICBpZiAoaXNUZW1wbGF0ZUlkKG5vZGUuaWQpICYmICFfLmlzRW1wdHkobm9kZS5jaGlsZHJlbikpXG4gICAgICAgIHJldHVybiA8UmVhY3QuRnJhZ21lbnQga2V5PXtub2RlLmlkfT57bm9kZS5jaGlsZHJlbn08L1JlYWN0LkZyYWdtZW50PlxuXG4gICAgICBsZXQgZGVwdGggPSBfLmZpbHRlcigoeCkgPT4gIWlzVGVtcGxhdGVJZCh4LmlkKSwgcGFyZW50cykubGVuZ3RoXG5cbiAgICAgIHJldHVybiByZW5kZXJUb2tlbih7XG4gICAgICAgIGtleTogbm9kZS5pZCxcbiAgICAgICAgW1wiZGF0YS1pZFwiXTogbm9kZS5pZCxcbiAgICAgICAgY2xhc3NOYW1lOiBgdmFyaWFudCR7ZGVwdGggJSA1fWAsXG4gICAgICAgIGNoaWxkcmVuOiBfLmlzRW1wdHkobm9kZS5jaGlsZHJlbilcbiAgICAgICAgICA/IHBhdGhGcm9tSWQobm9kZS5pZClcbiAgICAgICAgICA6IG5vZGUuY2hpbGRyZW4sXG4gICAgICB9KVxuICAgIH0pKHRyZWUpfVxuICA8L0JveD5cbilcblxubGV0IE11bHRpcGxlVmFsdWVQaWNrZXIgPSAoeyBvcHRpb25zLCBjaGlsZHJlbiwgLi4ucHJvcHMgfSkgPT4gKFxuICA8Q2hlY2tib3hHcm91cCB7Li4ucHJvcHN9PlxuICAgIDxTdGFjaz5cbiAgICAgIHtfLm1hcChcbiAgICAgICAgKG9wdGlvbikgPT4gKFxuICAgICAgICAgIDxDaGVja2JveCBrZXk9e29wdGlvbn0gdmFsdWU9e29wdGlvbn0+XG4gICAgICAgICAgICB7Y2hpbGRyZW4ob3B0aW9uKX1cbiAgICAgICAgICA8L0NoZWNrYm94PlxuICAgICAgICApLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKX1cbiAgICA8L1N0YWNrPlxuICA8L0NoZWNrYm94R3JvdXA+XG4pXG5cbmxldCBFeGNsdXNpdmVWYWx1ZVBpY2tlciA9ICh7IG9wdGlvbnMsIGNoaWxkcmVuLCAuLi5wcm9wcyB9KSA9PiAoXG4gIDxSYWRpb0dyb3VwIHsuLi5wcm9wc30+XG4gICAgPFN0YWNrPlxuICAgICAge18ubWFwKFxuICAgICAgICAob3B0aW9uKSA9PiAoXG4gICAgICAgICAgPFJhZGlvIGtleT17b3B0aW9ufSB2YWx1ZT17b3B0aW9ufT5cbiAgICAgICAgICAgIHtjaGlsZHJlbihvcHRpb24pfVxuICAgICAgICAgIDwvUmFkaW8+XG4gICAgICAgICksXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICApfVxuICAgIDwvU3RhY2s+XG4gIDwvUmFkaW9Hcm91cD5cbilcblxubGV0IEVtcHR5VmFsdWVQaWNrZXIgPSAoKSA9PiBudWxsXG5cbmxldCBWYWx1ZVBpY2tlciA9IG9ic2VydmVyKCh7IHN0b3JlLCAuLi5wcm9wcyB9KSA9PiB7XG4gIGxldCB7IHR5cGUgPSBcImRlZmF1bHRcIiwgb3B0aW9ucyA9IFtdIH0gPSBzdG9yZS5nZXRQYXJzZWRGaWxlKHN0b3JlLmlkKSB8fCB7fVxuICBsZXQgQ29tcG9uZW50ID0ge1xuICAgIGV4Y2x1c2l2ZTogRXhjbHVzaXZlVmFsdWVQaWNrZXIsXG4gICAgbXVsdGlwbGU6IE11bHRpcGxlVmFsdWVQaWNrZXIsXG4gICAgZGVmYXVsdDogRW1wdHlWYWx1ZVBpY2tlcixcbiAgfVt0eXBlXVxuICByZXR1cm4gKFxuICAgIDxDb21wb25lbnRcbiAgICAgIGtleT17c3RvcmUuaWR9XG4gICAgICBzaXplPVwic21cIlxuICAgICAgdmFsdWU9e2Yud2hlbihfLmlzQXJyYXksIF8udG9BcnJheSkoc3RvcmUudmFsdWVzLmdldChzdG9yZS5pZCkpfVxuICAgICAgb25DaGFuZ2U9eyh4KSA9PiBzdG9yZS52YWx1ZXMuc2V0KHN0b3JlLmlkLCB4KX1cbiAgICAgIG9wdGlvbnM9e29wdGlvbnN9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgPlxuICAgICAgeyhvcHRpb24pID0+IChcbiAgICAgICAgPFJlbmRlclRlbXBsYXRlXG4gICAgICAgICAgc3RvcmU9e3N0b3JlfVxuICAgICAgICAgIHRyZWU9e2J1aWxkVHJlZShmLmdldEluKHsgW2Ake3N0b3JlLnBhdGh9OjFgXTogb3B0aW9uIH0pKSh7XG4gICAgICAgICAgICBpZDogYCR7c3RvcmUucGF0aH06MWAsXG4gICAgICAgICAgfSl9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgIDwvQ29tcG9uZW50PlxuICApXG59KVxuXG5sZXQgTm90ZSA9IG9ic2VydmVyKCh7IHN0b3JlLCAuLi5wcm9wcyB9KSA9PiAoXG4gIDxSZW5kZXJUZW1wbGF0ZVxuICAgIGlkPVwibm90ZVwiXG4gICAgc3RvcmU9e3N0b3JlfVxuICAgIHRyZWU9e2J1aWxkVHJlZShzdG9yZS5nZXRWYWx1ZSkoeyBpZDogYCR7c3RvcmUucGF0aH06MWAgfSl9XG4gICAgcmVuZGVyVG9rZW49eyhwcm9wcykgPT4gKFxuICAgICAgPGFcbiAgICAgICAgaHJlZj1cIiNcIlxuICAgICAgICBvbkNsaWNrPXsoZSkgPT4gc3RvcmUucGF0aHMuc2V0KHN0b3JlLnBhdGgsIGUudGFyZ2V0LmRhdGFzZXQuaWQpfVxuICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAvPlxuICAgICl9XG4gIC8+XG4pKVxuXG5sZXQgRmlsZVBpY2tlciA9ICh7IHN0b3JlIH0pID0+IChcbiAgPFN0YWNrPlxuICAgIHtfLm1hcChcbiAgICAgIChwYXRoKSA9PiAoXG4gICAgICAgIDxCb3gga2V5PXtwYXRofT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICB2YXJpYW50PVwibGlua1wiXG4gICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgY29sb3JTY2hlbWU9XCJibGFja1wiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiAoc3RvcmUucGF0aCA9IHBhdGgpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtwYXRofVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0JveD5cbiAgICAgICksXG4gICAgICBfLmtleXMoeyAuLi5zdG9yZS50ZW1wbGF0ZXMsIC4uLnN0b3JlLmZpZWxkcyB9KSxcbiAgICApfVxuICA8L1N0YWNrPlxuKVxuXG5sZXQgUmVsb2FkRmlsZXNCdXR0b24gPSAoeyBzdG9yZSwgLi4ucHJvcHMgfSkgPT4gKFxuICA8QnV0dG9uXG4gICAgb25DbGljaz17YXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IGZpbGVzID0gYXdhaXQgcmVhZEZpbGVzKHtcbiAgICAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICAgICAgICBmaWx0ZXI6IG1hdGNoKC9cXC4oZmllbGR8dGVtcCkkLyksXG4gICAgICB9KVxuICAgICAgc3RvcmUuc2V0VGVtcGxhdGVzKGZpbGVzLmZpbHRlcigoeCkgPT4geC5uYW1lLmVuZHNXaXRoKFwiLnRlbXBcIikpKVxuICAgICAgc3RvcmUuc2V0RmllbGRzKGZpbGVzLmZpbHRlcigoeCkgPT4geC5uYW1lLmVuZHNXaXRoKFwiLmZpZWxkXCIpKSlcbiAgICB9fVxuICAgIHsuLi5wcm9wc31cbiAgPlxuICAgIFJlbG9hZCBmaWxlc1xuICA8L0J1dHRvbj5cbilcblxubGV0IENvcHlOb3RlQnV0dG9uID0gKHByb3BzKSA9PiAoXG4gIDxCdXR0b25cbiAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoXG4gICAgICAgIHN0cmlwdGFncyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vdGVcIikuaW5uZXJIVE1MKSxcbiAgICAgIClcbiAgICB9XG4gICAgey4uLnByb3BzfVxuICA+XG4gICAgQ29weSBOb3RlXG4gIDwvQnV0dG9uPlxuKVxuXG5sZXQgU2VjdGlvbiA9ICh7IGhlYWRlciwgY2hpbGRyZW4sIFRpdGxlLCAuLi5wcm9wcyB9KSA9PiAoXG4gIDxTdGFjayBiZz1cIndoaXRlXCIgYm9yZGVyUmFkaXVzPVwibWRcIiBib3hTaGFkb3c9XCJtZFwiIHNwYWNpbmc9XCIwXCIgey4uLnByb3BzfT5cbiAgICA8RmxleFxuICAgICAgYmc9XCJyZWQuMjAwXCJcbiAgICAgIHA9XCIyXCJcbiAgICAgIGp1c3RpZnlDb250ZW50PVwic3BhY2UtYmV0d2VlblwiXG4gICAgICBwb3M9XCJzdGlja3lcIlxuICAgICAgdG9wPVwiMFwiXG4gICAgPlxuICAgICAgPFRpdGxlIC8+XG4gICAgICB7aGVhZGVyfVxuICAgIDwvRmxleD5cbiAgICA8Qm94IHA9XCIzXCI+e2NoaWxkcmVufTwvQm94PlxuICA8L1N0YWNrPlxuKVxuXG5sZXQgbm90ZVRpdGxlID0gKHN0b3JlKSA9PiBvYnNlcnZlcigoKSA9PiA8Yj57c3RvcmUucGF0aCB8fCBcIjwtIFBpY2sgZmlsZVwifTwvYj4pXG5cbmxldCB2YWx1ZVBpY2tlclRpdGxlID0gKHN0b3JlKSA9PlxuICBvYnNlcnZlcigoKSA9PiA8Yj57cGF0aEZyb21JZChzdG9yZS5pZCkgfHwgXCI8LSBQaWNrIGZpZWxkXCJ9PC9iPilcblxubGV0IEFwcCA9ICh7IHN0b3JlIH0pID0+IChcbiAgPEdyaWRcbiAgICB3PVwiMTAwdndcIlxuICAgIGg9XCIxMDB2aFwiXG4gICAgcD1cIjJcIlxuICAgIGdhcD1cIjJcIlxuICAgIGJnPVwiZ3JheS4xMDBcIlxuICAgIGZvbnRGYW1pbHk9XCJtb25vc3BhY2VcIlxuICAgIGZvbnRTaXplPVwic21cIlxuICAgIGdyaWRUZW1wbGF0ZT17YFxuICAgICAgXCJmaWxlLXBpY2tlciBub3RlIHZhbHVlLXBpY2tlclwiIDEwMCVcbiAgICAgIC8gMjAlIDQwJSA0MCVcbiAgICBgfVxuICAgIHN4PXt7IFwiPiAqXCI6IHsgb3ZlcmZsb3c6IFwic2Nyb2xsXCIgfSB9fVxuICA+XG4gICAgPFNlY3Rpb25cbiAgICAgIFRpdGxlPXsoKSA9PiA8Yj5GaWxlczwvYj59XG4gICAgICBoZWFkZXI9ezxSZWxvYWRGaWxlc0J1dHRvbiBzaXplPVwieHNcIiBjb2xvclNjaGVtZT1cInJlZFwiIHN0b3JlPXtzdG9yZX0gLz59XG4gICAgPlxuICAgICAgPEZpbGVQaWNrZXIgc3RvcmU9e3N0b3JlfSBncmlkQXJlYT1cImZpbGUtcGlja2VyXCIgLz5cbiAgICA8L1NlY3Rpb24+XG4gICAgPFNlY3Rpb25cbiAgICAgIFRpdGxlPXtub3RlVGl0bGUoc3RvcmUpfVxuICAgICAgaGVhZGVyPXs8Q29weU5vdGVCdXR0b24gc2l6ZT1cInhzXCIgY29sb3JTY2hlbWU9XCJyZWRcIiAvPn1cbiAgICA+XG4gICAgICA8Tm90ZSBzdG9yZT17c3RvcmV9IGdyaWRBcmVhPVwibm90ZVwiIC8+XG4gICAgPC9TZWN0aW9uPlxuICAgIDxTZWN0aW9uIFRpdGxlPXt2YWx1ZVBpY2tlclRpdGxlKHN0b3JlKX0+XG4gICAgICA8VmFsdWVQaWNrZXIgc3RvcmU9e3N0b3JlfSBncmlkQXJlYT1cInZhbHVlLXBpY2tlclwiIC8+XG4gICAgPC9TZWN0aW9uPlxuICA8L0dyaWQ+XG4pXG5cbmV4cG9ydCBkZWZhdWx0IEFwcFxuIiwiaW1wb3J0IF8gZnJvbSBcImxvZGFzaC9mcFwiXG5pbXBvcnQgeyB0eXBlcyB9IGZyb20gXCJtb2J4LXN0YXRlLXRyZWVcIlxuaW1wb3J0IHBhdGggZnJvbSBcIi4vcGF0aFwiXG5pbXBvcnQgeyBpc1RlbXBsYXRlSWQsIHBhdGhGcm9tSWQgfSBmcm9tIFwiLi90cmVlXCJcblxubGV0IHBhcnNlRmllbGQgPSAodGV4dCkgPT4ge1xuICBsZXQgW3R5cGUsIC4uLm9wdGlvbnNdID0gXy5tYXAoXG4gICAgKHgpID0+IF8udHJpbSh4LCBcIlxcblwiKSxcbiAgICBfLnNwbGl0KC9cXG5cXHMqLVxccypcXG4vLCB0ZXh0KSxcbiAgKVxuICByZXR1cm4geyB0eXBlLCBvcHRpb25zIH1cbn1cblxubGV0IHBhcnNlRmlsZXMgPSAocGFyc2UpID0+XG4gIF8uZmxvdyhcbiAgICBfLmtleUJ5KChmaWxlKSA9PiBwYXRoLmRyb3BkaXJzKDEsIHBhdGguYWJzKGZpbGUud2Via2l0UmVsYXRpdmVQYXRoKSkpLFxuICAgIF8ubWFwVmFsdWVzKCh4KSA9PiBwYXJzZSh4LmRhdGEpKSxcbiAgKVxuXG5sZXQgRmllbGQgPSB0eXBlcy5tb2RlbCh7XG4gIHR5cGU6IHR5cGVzLmVudW1lcmF0aW9uKFtcImV4Y2x1c2l2ZVwiLCBcIm11bHRpcGxlXCJdKSxcbiAgb3B0aW9uczogdHlwZXMuYXJyYXkodHlwZXMuc3RyaW5nKSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IHR5cGVzXG4gIC5tb2RlbCh7XG4gICAgcGF0aDogdHlwZXMubWF5YmUodHlwZXMuc3RyaW5nKSxcbiAgICBwYXRoczogdHlwZXMubWFwKHR5cGVzLnN0cmluZyksXG4gICAgdmFsdWVzOiB0eXBlcy5tYXAodHlwZXMudW5pb24odHlwZXMuc3RyaW5nLCB0eXBlcy5hcnJheSh0eXBlcy5zdHJpbmcpKSksXG4gICAgLy8gUmVhZCBmcm9tIGZpbGVzeXN0ZW1cbiAgICB0ZW1wbGF0ZXM6IHR5cGVzLm9wdGlvbmFsKHR5cGVzLmZyb3plbih0eXBlcy5tYXAodHlwZXMuc3RyaW5nKSksIHt9KSxcbiAgICBmaWVsZHM6IHR5cGVzLm9wdGlvbmFsKHR5cGVzLmZyb3plbih0eXBlcy5tYXAoRmllbGQpKSwge30pLFxuICB9KVxuICAudmlld3MoKHNlbGYpID0+ICh7XG4gICAgZ2V0IGlkKCkge1xuICAgICAgcmV0dXJuIHNlbGYucGF0aHMuZ2V0KHNlbGYucGF0aClcbiAgICB9LFxuICAgIGdldFZhbHVlKGlkKSB7XG4gICAgICByZXR1cm4gaXNUZW1wbGF0ZUlkKGlkKVxuICAgICAgICA/IHNlbGYudGVtcGxhdGVzW3BhdGhGcm9tSWQoaWQpXVxuICAgICAgICA6IHNlbGYudmFsdWVzLmdldChpZClcbiAgICB9LFxuICAgIGdldFBhcnNlZEZpbGUoaWQpIHtcbiAgICAgIHJldHVybiBpc1RlbXBsYXRlSWQoaWQpXG4gICAgICAgID8gc2VsZi50ZW1wbGF0ZXNbcGF0aEZyb21JZChpZCldXG4gICAgICAgIDogc2VsZi5maWVsZHNbcGF0aEZyb21JZChpZCldXG4gICAgfSxcbiAgfSkpXG4gIC5hY3Rpb25zKChzZWxmKSA9PiAoe1xuICAgIHNldFRlbXBsYXRlcyhmaWxlcykge1xuICAgICAgc2VsZi50ZW1wbGF0ZXMgPSBwYXJzZUZpbGVzKF8ucmVwbGFjZSgvXFxuKiQvLCBcIlwiKSkoZmlsZXMpXG4gICAgfSxcbiAgICBzZXRGaWVsZHMoZmlsZXMpIHtcbiAgICAgIHNlbGYuZmllbGRzID0gcGFyc2VGaWxlcyhwYXJzZUZpZWxkKShmaWxlcylcbiAgICB9LFxuICB9KSlcbiIsImltcG9ydCBfIGZyb20gXCJsb2Rhc2gvZnBcIlxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiXG5pbXBvcnQgeyBjb25maWd1cmUgfSBmcm9tIFwibW9ieFwiXG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiXG5pbXBvcnQgeyBDaGFrcmFQcm92aWRlciwgZXh0ZW5kVGhlbWUgfSBmcm9tIFwiQGNoYWtyYS11aS9yZWFjdFwiXG5pbXBvcnQgeyBvblNuYXBzaG90LCBnZXRTbmFwc2hvdCwgdW5wcm90ZWN0IH0gZnJvbSBcIm1vYngtc3RhdGUtdHJlZVwiXG5pbXBvcnQgQXBwIGZyb20gXCIuL0FwcFwiXG5pbXBvcnQgbW9kZWwgZnJvbSBcIi4vbW9kZWxcIlxuXG5jb25maWd1cmUoeyBlbmZvcmNlQWN0aW9uczogXCJuZXZlclwiIH0pXG5cbmxldCBzdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZVxuXG5sZXQgc3RvcmUgPSBtb2RlbC5jcmVhdGUoSlNPTi5wYXJzZShzdG9yYWdlLmdldEl0ZW0oXCJzdG9yZVwiKSkgfHwgdW5kZWZpbmVkKVxuXG51bnByb3RlY3Qoc3RvcmUpXG5cbm9uU25hcHNob3Qoc3RvcmUsICh4KSA9PiBzdG9yYWdlLnNldEl0ZW0oXCJzdG9yZVwiLCBKU09OLnN0cmluZ2lmeSh4KSkpXG5cblJlYWN0RE9NLnJlbmRlcihcbiAgPFJlYWN0LlN0cmljdE1vZGU+XG4gICAgPENoYWtyYVByb3ZpZGVyPlxuICAgICAgPEFwcCBzdG9yZT17c3RvcmV9IC8+XG4gICAgPC9DaGFrcmFQcm92aWRlcj5cbiAgPC9SZWFjdC5TdHJpY3RNb2RlPixcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpLFxuKVxuIl0sIm5hbWVzIjpbInBhdGgiLCJfIiwiYnVpbGRUcmVlIiwiZGlyZWN0b3J5T3BlbiIsIm1ha2VWYXJpYW50IiwiY29sb3IiLCJiZyIsImJvcmRlclJpZ2h0IiwiYm9yZGVyTGVmdCIsImJvcmRlckNvbG9yIiwiZGVmYXVsdFJlbmRlclRva2VuIiwicHJvcHMiLCJSZW5kZXJUZW1wbGF0ZSIsInN0b3JlIiwidHJlZSIsInN4IiwicmVuZGVyVG9rZW4iLCJ3aGl0ZVNwYWNlIiwiY3Vyc29yIiwidGV4dERlY29yYXRpb24iLCJUcmVlIiwibWFwIiwiaWRlbnRpdHkiLCJub2RlIiwiaSIsInBhcmVudHMiLCJpc1N0cmluZyIsImdldFBhcnNlZEZpbGUiLCJpZCIsInBhdGhGcm9tSWQiLCJpc1RlbXBsYXRlSWQiLCJpc0VtcHR5IiwiY2hpbGRyZW4iLCJkZXB0aCIsImZpbHRlciIsIngiLCJsZW5ndGgiLCJrZXkiLCJjbGFzc05hbWUiLCJNdWx0aXBsZVZhbHVlUGlja2VyIiwib3B0aW9ucyIsIm9wdGlvbiIsIkV4Y2x1c2l2ZVZhbHVlUGlja2VyIiwiRW1wdHlWYWx1ZVBpY2tlciIsIlZhbHVlUGlja2VyIiwib2JzZXJ2ZXIiLCJ0eXBlIiwiQ29tcG9uZW50IiwiZXhjbHVzaXZlIiwibXVsdGlwbGUiLCJkZWZhdWx0IiwiZiIsIndoZW4iLCJpc0FycmF5IiwidG9BcnJheSIsInZhbHVlcyIsImdldCIsInNldCIsImdldEluIiwiTm90ZSIsImdldFZhbHVlIiwiZSIsInBhdGhzIiwidGFyZ2V0IiwiZGF0YXNldCIsIkZpbGVQaWNrZXIiLCJrZXlzIiwidGVtcGxhdGVzIiwiZmllbGRzIiwiUmVsb2FkRmlsZXNCdXR0b24iLCJmaWxlcyIsInJlYWRGaWxlcyIsInJlY3Vyc2l2ZSIsIm1hdGNoIiwic2V0VGVtcGxhdGVzIiwibmFtZSIsImVuZHNXaXRoIiwic2V0RmllbGRzIiwiQ29weU5vdGVCdXR0b24iLCJuYXZpZ2F0b3IiLCJjbGlwYm9hcmQiLCJ3cml0ZVRleHQiLCJzdHJpcHRhZ3MiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwiU2VjdGlvbiIsImhlYWRlciIsIlRpdGxlIiwibm90ZVRpdGxlIiwidmFsdWVQaWNrZXJUaXRsZSIsIkFwcCIsIm92ZXJmbG93IiwiY29uZmlndXJlIiwiZW5mb3JjZUFjdGlvbnMiLCJzdG9yYWdlIiwid2luZG93IiwibG9jYWxTdG9yYWdlIiwibW9kZWwiLCJjcmVhdGUiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwidW5kZWZpbmVkIiwidW5wcm90ZWN0Iiwib25TbmFwc2hvdCIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJSZWFjdERPTSIsInJlbmRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLElBQUksb0JBQW9CO0FBQzFCLFFBQU0sVUFBVSxTQUFTLGNBQWMsUUFBUTtBQUMvQyxNQUFJLFdBQVcsUUFBUSxZQUFZLFFBQVEsU0FBUyxrQkFBa0I7QUFDbEU7QUFBQTtBQUVKLGFBQVcsUUFBUSxTQUFTLGlCQUFpQiw4QkFBOEI7QUFDdkUsbUJBQWU7QUFBQTtBQUVuQixNQUFJLGlCQUFpQixDQUFDLGNBQWM7QUFDaEMsZUFBVyxZQUFZLFdBQVc7QUFDOUIsVUFBSSxTQUFTLFNBQVMsYUFBYTtBQUMvQjtBQUFBO0FBRUosaUJBQVcsUUFBUSxTQUFTLFlBQVk7QUFDcEMsWUFBSSxLQUFLLFlBQVksVUFBVSxLQUFLLFFBQVE7QUFDeEMseUJBQWU7QUFBQTtBQUFBO0FBQUEsS0FHNUIsUUFBUSxVQUFVLEVBQUUsV0FBVyxNQUFNLFNBQVM7QUFDakQsd0JBQXNCLFFBQVE7QUFDMUIsVUFBTSxZQUFZO0FBQ2xCLFFBQUksT0FBTztBQUNQLGdCQUFVLFlBQVksT0FBTztBQUNqQyxRQUFJLE9BQU87QUFDUCxnQkFBVSxpQkFBaUIsT0FBTztBQUN0QyxRQUFJLE9BQU8sZ0JBQWdCO0FBQ3ZCLGdCQUFVLGNBQWM7QUFBQSxhQUNuQixPQUFPLGdCQUFnQjtBQUM1QixnQkFBVSxjQUFjO0FBQUE7QUFFeEIsZ0JBQVUsY0FBYztBQUM1QixXQUFPO0FBQUE7QUFFWCwwQkFBd0IsTUFBTTtBQUMxQixRQUFJLEtBQUs7QUFFTDtBQUNKLFNBQUssS0FBSztBQUVWLFVBQU0sWUFB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
