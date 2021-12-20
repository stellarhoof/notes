import _ from "lodash/fp"
import { types } from "mobx-state-tree"
import path from "./path"
import { isTemplateId, pathFromId } from "./tree"

let parseField = (text) => {
  let [type, ...options] = _.map(
    (x) => _.trim(x, "\n"),
    _.split(/\n\s*-\s*\n/, text),
  )
  return { type, options }
}

let parseFiles = (parse) =>
  _.flow(
    _.keyBy((file) => path.dropdirs(1, path.abs(file.webkitRelativePath))),
    _.mapValues((x) => parse(x.data)),
  )

let Field = types.model({
  type: types.enumeration(["exclusive", "multiple"]),
  options: types.array(types.string),
})

export default types
  .model({
    path: types.maybe(types.string),
    paths: types.map(types.string),
    values: types.map(types.union(types.string, types.array(types.string))),
    // Read from filesystem
    templates: types.optional(types.frozen(types.map(types.string)), {}),
    fields: types.optional(types.frozen(types.map(Field)), {}),
  })
  .views((self) => ({
    get id() {
      return self.paths.get(self.path)
    },
    getValue(id) {
      return isTemplateId(id)
        ? self.templates[pathFromId(id)]
        : self.values.get(id)
    },
    getParsedFile(id) {
      return isTemplateId(id)
        ? self.templates[pathFromId(id)]
        : self.fields[pathFromId(id)]
    },
  }))
  .actions((self) => ({
    setTemplates(files) {
      self.templates = parseFiles(_.replace(/\n*$/, ""))(files)
    },
    setFields(files) {
      self.fields = parseFiles(parseField)(files)
    },
  }))
