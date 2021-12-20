import { expect } from "@esm-bundle/chai"
import path from "./path"

describe("dropDirs()", () => {
  it("should drop first dir of absolute path", () => {
    let expected = "/bar/baz"
    let actual = path.dropDirs(1, "/foo/bar/baz")
    expect(actual).to.equal(expected)
  })

  it("should drop first dir of relative path", () => {
    let expected = "bar/baz"
    let actual = path.dropDirs(1, "foo/bar/baz")
    expect(actual).to.equal(expected)
  })
})
