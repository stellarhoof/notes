import f from "futil"
import { expect } from "@esm-bundle/chai"
import {
  expandTemplate,
  addFieldsCounts,
  renderTemplate,
} from "./renderTemplate"

describe("expandTemplate()", () => {
  describe("should expand an absolute path nested template", () => {
    it("when top template is in the root directory", () => {
      let templates = {
        "/top": "(top {{#/absolute/nested}})",
        "/absolute/nested": "(nested)",
      }

      let actual = expandTemplate(templates)("{{#/top}}")

      let expected = "(top (nested))"

      expect(actual).to.equal(expected)
    })

    it("when top template is in a sub directory", () => {
      let templates = {
        "/sub/top": "(top {{#/absolute/nested}})",
        "/absolute/nested": "(nested)",
      }

      let actual = expandTemplate(templates)("{{#/sub/top}}")

      let expected = "(top (nested))"

      expect(actual).to.equal(expected)
    })
  })

  describe("should expand a relative path nested template", () => {
    it("when top template is in the root directory", () => {
      let templates = {
        "/top": "(top {{#relative/nested}})",
        "/relative/nested": "(nested)",
      }

      let actual = expandTemplate(templates)("{{#/top}}")

      let expected = "(top (nested))"

      expect(actual).to.equal(expected)
    })

    it("when top template is in a sub directory", () => {
      let templates = {
        "/sub/top": "(top {{#relative/nested}})",
        "/sub/relative/nested": "(nested)",
      }

      let actual = expandTemplate(templates)("{{#/sub/top}}")

      let expected = "(top (nested))"

      expect(actual).to.equal(expected)
    })
  })

  it("should expand an absolute path field", () => {
    let templates = {
      "/top": "(top {{/absolute/field}})",
    }

    let actual = expandTemplate(templates)("{{#/top}}")

    let expected = "(top {{/top:/absolute/field}})"

    expect(actual).to.equal(expected)
  })

  it("should expand a relative path field", () => {
    let templates = {
      "/top": "(top {{relative/field}})",
    }

    let actual = expandTemplate(templates)("{{#/top}}")

    let expected = "(top {{/top:/relative/field}})"

    expect(actual).to.equal(expected)
  })

  it("should prefix field with paths of parent templates", () => {
    let templates = {
      "/top": "(top {{#nested1}} {{#nested2}})",
      "/nested1": "(nested1 {{field}})",
      "/nested2": "(nested2 {{field}})",
    }

    let actual = expandTemplate(templates)("{{#/top}}")

    let expected =
      "(top (nested1 {{/top:/nested1:/field}}) (nested2 {{/top:/nested2:/field}}))"

    expect(actual).to.equal(expected)
  })
})

describe("addFieldsCounts()", () => {
  it("should increment repeated field count", () => {
    let actual = addFieldsCounts()("(top {{/top:/field}} {{/top:/field}})")

    let expected = "(top {{/top:/field:1}} {{/top:/field:2}})"

    expect(actual).to.equal(expected)
  })
})

describe("renderTemplate()", () => {
  it("works", () => {
    let values = {
      "/top:/field:0": "(field0)",
    }

    let actual = renderTemplate(values)("(top {{/top:/field:0}})")

    let expected = "(top (field0))"

    expect(actual).to.equal(expected)
  })
})
