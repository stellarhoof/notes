import _ from "lodash/fp"
import { types } from "mobx-state-tree"

export default types.model({
  data: types.map(types.union(types.string, types.array(types.string))),
  template: types.maybe(types.string),
  field: types.maybe(types.string),
  templates: types.maybe(types.frozen(types.map(types.string))),
  fields: types.maybe(types.frozen(types.map(types.string))),
})
