import _ from "lodash/fp"
import f from "futil"
import { isAbsolute, dirname, join } from "path-browserify"

let tokens = {
  template: Symbol("template"),
  field: Symbol("field"),
}

let tokenType = (token) =>
  token.startsWith("{{#") ? tokens.template : tokens.field

let replaceTokens = (replacers) =>
  _.replace(/{{#?\s*([\w\/:]+)\s*}}/g, (token, value) =>
    _.getOr(_.constant(token), tokenType(token), replacers)(value, token),
  )

let makeFieldToken = (paths) => `{{${paths.join(":")}}}`

let makeTemplateToken = (path) => `{{#${path}}}`

export let expandTemplate = (templates) => {
  let paths = []

  let resolvePath = (value = "") =>
    isAbsolute(value) ? value : join(dirname(_.last(paths) || "/"), value)

  let replacers = {
    [tokens.field]: (path) => makeFieldToken([...paths, resolvePath(path)]),
    [tokens.template]: (path, token) => {
      let absolute = resolvePath(path)
      paths.push(absolute)
      let result = replaceTokens(replacers)(templates[absolute])
      paths.pop()
      return result || makeTemplateToken(absolute)
    },
  }

  return replaceTokens(replacers)
}

export let addFieldsCounts = (counts = {}) =>
  replaceTokens({
    [tokens.field]: (path) => {
      counts[path] = _.add(counts[path], 1)
      return makeFieldToken([path, counts[path]])
    },
  })

export let getFieldPath = _.flow(_.split(":"), _.nth(-2))

export let highlightTokens = (templates, fields) =>
  replaceTokens({
    [tokens.field]: (path, token) => {
      let fieldPath = getFieldPath(path)
      let exists = _.has(fieldPath, fields)
      let href = exists ? "href" : ""
      return `<a ${href} data-exists=${exists} data-path=${path}>${token}</a>`
    },
    [tokens.template]: (path, token) => {
      let exists = _.has(path, templates)
      let href = exists ? "href" : ""
      return `<a ${href} data-exists=${exists} data-path=${path}>${token}</a>`
    },
  })

export let processTemplate = (templates, fields) =>
  _.flow(
    expandTemplate(templates),
    addFieldsCounts(),
    highlightTokens(templates, fields),
  )

let foo = new Intl.ListFormat("en", { style: "long", type: "conjunction" })

export let renderTemplate = (values) =>
  replaceTokens({
    [tokens.field]: (path, token) => {
      let value = values.get(path)
      if (!_.isEmpty(value)) return _.isArray(value) ? foo.format(value) : value
      return token
    },
  })
