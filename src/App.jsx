import _ from "lodash/fp"
import path from "path-browserify"
import { observer } from "mobx-react-lite"
import { directoryOpen } from "browser-fs-access"
import {
  Flex,
  Box,
  Button,
  Code,
  Stack,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react"
import { getFieldPath, processTemplate, renderTemplate } from "./renderTemplate"

let getFiles = async () => {
  let result = { templates: {}, fields: {} }
  let utf8decoder = new TextDecoder()
  for (let file of await directoryOpen({ recursive: true })) {
    let match = _.head(file.name.match("(field|template)$"))
    if (match) {
      let key = file.webkitRelativePath.replace(
        /\w+(.*)\.(field|template)$/,
        (_, path) => path,
      )
      result[`${match}s`][key] = utf8decoder.decode(await file.arrayBuffer())
    }
  }
  return result
}

let parseField = (text) => {
  let [type, ...options] = _.map((x) => _.trim(x, "\n"), _.split("\n-\n", text))
  return { type, options }
}

let ValuePicker = ({ field, type, options, ...props }) =>
  type === "exclusive" ? (
    <RadioGroup size="sm" {...props}>
      <Stack>
        {_.map(
          (option) => (
            <Radio key={option} value={option}>
              {option}
            </Radio>
          ),
          options,
        )}
      </Stack>
    </RadioGroup>
  ) : (
    <CheckboxGroup size="sm" {...props}>
      <Stack>
        {_.map(
          (option) => (
            <Checkbox key={option} value={option}>
              {option}
            </Checkbox>
          ),
          options,
        )}
      </Stack>
    </CheckboxGroup>
  )

let App = ({ store }) => (
  <Flex
    w="100vw"
    h="100vh"
    fontFamily="monospace"
    sx={{
      "> *:not(hr)": { flex: 1, p: 4, h: "100%", overflow: "scroll" },
      a: {
        bg: "yellow.100",
        boxShadow: "0 1px 2px 0px #ECC94B",
        "&[data-exists=true]": {
          cursor: "pointer",
          ":hover": { bg: "yellow.200" },
        },
        "&[data-exists=false]": {
          bg: "red.100",
          boxShadow: "0 1px 2px 0px #FC8181",
        },
        [`&[data-path="${store.field}"]`]: {
          bg: "green.100",
          border: "10px black",
          boxShadow: "0 1px 2px 0px #48BB78",
          ":hover": { bg: "green.200" },
        },
      },
    }}
  >
    <Code
      whiteSpace="pre-wrap"
      dangerouslySetInnerHTML={{
        __html: renderTemplate(store.data)(store.template),
      }}
      onClick={(e) =>
        e.target.tagName === "A" &&
        e.target.dataset["exists"] === "true" &&
        (store.field = e.target.dataset["path"])
      }
    />
    <Stack>
      <Button
        size="sm"
        onClick={async () => {
          let { fields, templates } = await getFiles()
          store.templates = templates
          store.fields = fields
          store.template = processTemplate(templates, fields)("{{#nota}}")
        }}
      >
        Reload files
      </Button>
      <ValuePicker
        key={store.field}
        value={store.data.get(store.field)}
        onChange={(x) => store.data.set(store.field, x)}
        {...parseField(_.get(getFieldPath(store.field), store.fields))}
      />
    </Stack>
  </Flex>
)

export default observer(App)
