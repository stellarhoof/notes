import _ from "lodash/fp"
import f from "futil"
import { expect } from "@esm-bundle/chai"
import { parseTemplate } from "./model"
import { buildTree, renderTree } from "./tree"

describe("buildTree()", () => {
  it("should not fail on missing root template", () => {
    let getValue = _.noop

    let actual = buildTree(getValue)({ id: "/root.temp:1" })

    let expected = { id: "/root.temp:1" }

    expect(actual).to.deep.equal(expected)
  })

  it("should expand root template", () => {
    let getValue = f.getIn({
      "/root.temp:1": ["(root)"],
    })

    let actual = buildTree(getValue)({ id: "/root.temp:1" })

    let expected = {
      id: "/root.temp:1",
      children: ["(root)"],
    }

    expect(actual).to.deep.equal(expected)
  })

  it("should expand nested template", () => {
    let getValue = f.getIn({
      "/root.temp:1": ["(root ", "{{/nested.temp}}", ")"],
      "/root.temp:1:/nested.temp:1": ["(nested)"],
    })

    let actual = buildTree(getValue)({ id: "/root.temp:1" })

    let expected = {
      id: "/root.temp:1",
      children: [
        "(root ",
        { id: "/root.temp:1:/nested.temp:1", children: ["(nested)"] },
        ")",
      ],
    }

    expect(actual).to.deep.equal(expected)
  })

  it("should not expand missing template", () => {
    let getValue = f.getIn({
      "/root.temp:1": ["(root ", "{{/miss.temp}}", ")"],
    })

    let actual = buildTree(getValue)({ id: "/root.temp:1" })

    let expected = {
      id: "/root.temp:1",
      children: ["(root ", { id: "/root.temp:1:/miss.temp:1" }, ")"],
    }

    expect(actual).to.deep.equal(expected)
  })

  it("should make field node", () => {
    let getValue = f.getIn({
      "/root.temp:1": ["(root ", "{{/name.field}}", ")"],
    })

    let actual = buildTree(getValue)({ id: "/root.temp:1" })

    let expected = {
      id: "/root.temp:1",
      children: ["(root ", { id: "/root.temp:1:/name.field:1" }, ")"],
    }

    expect(actual).to.deep.equal(expected)
  })

  it("should resolve relative token paths", () => {
    let getValue = f.getIn({
      "/sub/root.temp:1": [
        "(root ",
        "{{name.field}}",
        " ",
        "{{nested.temp}}",
        ")",
      ],
    })

    let actual = buildTree(getValue)({ id: "/sub/root.temp:1" })

    let expected = {
      id: "/sub/root.temp:1",
      children: [
        "(root ",
        { id: "/sub/root.temp:1:/sub/name.field:1" },
        " ",
        { id: "/sub/root.temp:1:/sub/nested.temp:1" },
        ")",
      ],
    }

    expect(actual).to.deep.equal(expected)
  })

  it("should lookup field value", () => {
    let getValue = f.getIn({
      "/root.temp:1": ["(root ", "{{name.field}}", ")"],
      "/root.temp:1:/name.field:1": ["(field)"],
    })

    let actual = buildTree(getValue)({ id: "/root.temp:1" })

    let expected = {
      id: "/root.temp:1",
      children: [
        "(root ",
        { id: "/root.temp:1:/name.field:1", children: ["(field)"] },
        ")",
      ],
    }

    expect(actual).to.deep.equal(expected)
  })

  it("should set unique ids", () => {
    let getValue = f.getIn({
      "/root.temp:1": ["{{nested.temp}}", "{{nested.temp}}"],
      "/root.temp:1:/nested.temp:1": ["{{name.field}}", "{{name.field}}"],
      "/root.temp:1:/nested.temp:2": ["{{name.field}}", "{{name.field}}"],
      "/root.temp:1:/nested.temp:1:/name.field:1": ["(field1)"],
      "/root.temp:1:/nested.temp:1:/name.field:2": ["(field2)"],
      "/root.temp:1:/nested.temp:2:/name.field:1": ["(field3)"],
      "/root.temp:1:/nested.temp:2:/name.field:2": ["(field4)"],
    })

    let actual = buildTree(getValue)({ id: "/root.temp:1" })

    let expected = {
      id: "/root.temp:1",
      children: [
        {
          id: "/root.temp:1:/nested.temp:1",
          children: [
            {
              id: "/root.temp:1:/nested.temp:1:/name.field:1",
              children: ["(field1)"],
            },
            {
              id: "/root.temp:1:/nested.temp:1:/name.field:2",
              children: ["(field2)"],
            },
          ],
        },
        {
          id: "/root.temp:1:/nested.temp:2",
          children: [
            {
              id: "/root.temp:1:/nested.temp:2:/name.field:1",
              children: ["(field3)"],
            },
            {
              id: "/root.temp:1:/nested.temp:2:/name.field:2",
              children: ["(field4)"],
            },
          ],
        },
      ],
    }

    expect(actual).to.deep.equal(expected)
  })
})

describe("renderTree()", () => {
  it("works1", () => {
    let getValue = f.getIn({
      "/root.temp:1": ["(root ", "{{name.field}}", " ", "{{nested.temp}}", ")"],
      "/root.temp:1:/nested.temp:1": ["(nested)"],
      "/root.temp:1:/name.field:1": ["(field)"],
    })

    let tree = buildTree(getValue)({ id: "/root.temp:1" })

    let actual = renderTree(_.constant(true))(tree)

    let expected =
      "(root <mark data-id=/root.temp:1:/name.field:1>(field)</mark> (nested))"

    expect(actual).to.equal(expected)
  })

  it("works2", () => {
    let getValue = f.getIn({
      "/root.temp:1": ["(root ", "{{name.field}}", " ", "{{nested.temp}}", ")"],
      "/root.temp:1:/nested.temp:1": ["(nested)"],
      "/root.temp:1:/name.field:1": ["(field)"],
    })

    let tree = buildTree(getValue)({ id: "/root.temp:1" })

    let actual = renderTree(_.constant(false))(tree)

    let expected = "(root <mark>/name.field</mark> (nested))"

    expect(actual).to.equal(expected)
  })

  it("works3", () => {
    let getValue = f.getIn({
      "/root.temp:1": ["(root ", "{{name.field}}", " ", "{{nested.temp}}", ")"],
      "/root.temp:1:/nested.temp:1": ["(nested)"],
    })

    let tree = buildTree(getValue)({ id: "/root.temp:1" })

    let actual = renderTree(_.constant(true))(tree)

    let expected = "(root <mark data-id=/root.temp:1:/name.field:1>/name.field</mark> (nested))"

    expect(actual).to.equal(expected)
  })
})
