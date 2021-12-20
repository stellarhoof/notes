import f from "futil"
import _ from "lodash/fp"

export let match = _.curry((pattern, str) => str?.match(pattern))

let writeProperty =
  (next = traverse) =>
  (node, index, [parent]) => {
    if (parent) f.setOn(index, node, next(parent))
  }

let transformTree =
  (next = f.traverse) =>
  (...args) =>
  (tree) => {
    let result = _.cloneDeep(tree)
    f.walk(next)(...args)(result)
    return result
  }

let mapTree =
  (next = f.traverse, writeNode = writeProperty(next)) =>
  (pre, post = _.identity, ...args) => {
    let write =
      (fn) =>
      (node, ...args) => {
        writeNode(fn(node, ...args), ...args)
      }
    return _.flow(
      pre,
      transformTree(next)(write(pre), write(post), ...args),
      post,
    )
  }

let buildTree =
  (next = f.traverse, writeNode = writeProperty(next)) =>
  (generateNext) =>
    transformTree(generateNext)(writeNode)

export let tree = (
  next = traverse,
  buildIteratee = _.identity,
  writeNode = writeProperty(next),
) => ({
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
  build: buildTree(next, writeNode),
})
