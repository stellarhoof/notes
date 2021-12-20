import _ from "lodash/fp"
import path from "path-browserify"

let abs = (x) => path.resolve("/", x)

let delimjoin = (...args) => _.join(path.delimiter, _.compact(args))

let delimsplit = _.split(path.delimiter)

let dropdirs = (n, x) => {
  let [first, ...rest] = _.split(path.sep, x)
  return _.join(
    path.sep,
    first === "" ? [first, ..._.drop(n, rest)] : _.drop(n, [first, ...rest]),
  )
}

export default { ...path, abs, delimjoin, delimsplit, dropdirs }
