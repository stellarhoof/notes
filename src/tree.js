import _ from "lodash/fp"
import f from "futil"
import path from "./path"
import { tree, match } from "./futil"

export let isTemplateId = _.flow(match(/\.temp:\d+$/))

export let pathFromId = _.flow(path.delimsplit, _.nth(-2))

export let Tree = tree(
  _.get("children"),
  _.identity,
  (node, index, [parent]) => {
    f.setOn(["children", index], node, parent)
  },
)

let tokenize = _.flow(_.split(/({{.+?}})/), _.compact)

export let buildTree = (getValue) => {
  let getPath = (token) => _.nth(1, token.match(/^{{\s*(.*)\s*}}$/))

  let cache = {}

  let genId = (parent, tokenPath) => {
    let fullpath = path.resolve(path.dirname(pathFromId(parent.id)), tokenPath)
    let key = path.delimjoin(parent.id, fullpath)
    cache[key] = _.add(cache[key], 1)
    return path.delimjoin(key, cache[key])
  }

  return Tree.build((node) =>
    _.map(
      f.when(getPath, (x) => ({ id: genId(node, getPath(x)) })),
      tokenize(getValue(node.id)),
    ),
  )
}
