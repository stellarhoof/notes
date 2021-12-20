import _ from "lodash/fp"
import f from "futil"
import React from "react"
import striptags from "striptags"
import { observer } from "mobx-react-lite"
import {
  Flex,
  Box,
  Button,
  Center,
  Heading,
  Code,
  Stack,
  Radio,
  Grid,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react"
import path from "./path"
import { match } from "./futil"
import { readFiles } from "./browser-fs-access"
import { pathFromId, isTemplateId, buildTree, Tree } from "./tree"

// let foo = new Intl.ListFormat("en", { style: "long", type: "conjunction" })

let makeVariant = (color) => ({
  bg: `${color}.100`,
  borderRight: "3px solid",
  borderLeft: "3px solid",
  borderColor: `${color}.400`,
})

let defaultRenderToken = (props) => <span {...props} />

let RenderTemplate = ({
  store,
  tree,
  sx,
  renderToken = defaultRenderToken,
  ...props
}) => (
  <Box
    as="span"
    sx={{
      whiteSpace: "pre-wrap",
      "[data-id]": { cursor: "pointer", textDecoration: "none" },
      ".variant0": makeVariant("green"),
      ".variant1": makeVariant("teal"),
      ".variant2": makeVariant("blue"),
      ".variant3": makeVariant("cyan"),
      ".variant4": makeVariant("purple"),
      ...sx,
    }}
    {...props}
  >
    {Tree.map(_.identity, (node, i, parents) => {
      if (_.isString(node)) return node

      if (!store.getParsedFile(node.id))
        return (
          <Box
            as="span"
            key={node.id}
            bg="gray.100"
            textDecoration="line-through"
          >
            {pathFromId(node.id)}
          </Box>
        )

      if (isTemplateId(node.id) && !_.isEmpty(node.children))
        return <React.Fragment key={node.id}>{node.children}</React.Fragment>

      let depth = _.filter((x) => !isTemplateId(x.id), parents).length

      return renderToken({
        key: node.id,
        ["data-id"]: node.id,
        className: `variant${depth % 5}`,
        children: _.isEmpty(node.children)
          ? pathFromId(node.id)
          : node.children,
      })
    })(tree)}
  </Box>
)

let MultipleValuePicker = ({ options, children, ...props }) => (
  <CheckboxGroup {...props}>
    <Stack>
      {_.map(
        (option) => (
          <Checkbox key={option} value={option}>
            {children(option)}
          </Checkbox>
        ),
        options,
      )}
    </Stack>
  </CheckboxGroup>
)

let ExclusiveValuePicker = ({ options, children, ...props }) => (
  <RadioGroup {...props}>
    <Stack>
      {_.map(
        (option) => (
          <Radio key={option} value={option}>
            {children(option)}
          </Radio>
        ),
        options,
      )}
    </Stack>
  </RadioGroup>
)

let EmptyValuePicker = () => null

let ValuePicker = observer(({ store, ...props }) => {
  let { type = "default", options = [] } = store.getParsedFile(store.id) || {}
  let Component = {
    exclusive: ExclusiveValuePicker,
    multiple: MultipleValuePicker,
    default: EmptyValuePicker,
  }[type]
  return (
    <Component
      key={store.id}
      size="sm"
      value={f.when(_.isArray, _.toArray)(store.values.get(store.id))}
      onChange={(x) => store.values.set(store.id, x)}
      options={options}
      {...props}
    >
      {(option) => (
        <RenderTemplate
          store={store}
          tree={buildTree(f.getIn({ [`${store.path}:1`]: option }))({
            id: `${store.path}:1`,
          })}
        />
      )}
    </Component>
  )
})

let Note = observer(({ store, ...props }) => (
  <RenderTemplate
    id="note"
    store={store}
    tree={buildTree(store.getValue)({ id: `${store.path}:1` })}
    renderToken={(props) => (
      <a
        href="#"
        onClick={(e) => store.paths.set(store.path, e.target.dataset.id)}
        {...props}
      />
    )}
  />
))

let FilePicker = ({ store }) => (
  <Stack>
    {_.map(
      (path) => (
        <Box key={path}>
          <Button
            variant="link"
            size="sm"
            colorScheme="black"
            onClick={() => (store.path = path)}
          >
            {path}
          </Button>
        </Box>
      ),
      _.keys({ ...store.templates, ...store.fields }),
    )}
  </Stack>
)

let ReloadFilesButton = ({ store, ...props }) => (
  <Button
    onClick={async () => {
      let files = await readFiles({
        recursive: true,
        filter: match(/\.(field|temp)$/),
      })
      store.setTemplates(files.filter((x) => x.name.endsWith(".temp")))
      store.setFields(files.filter((x) => x.name.endsWith(".field")))
    }}
    {...props}
  >
    Reload files
  </Button>
)

let CopyNoteButton = (props) => (
  <Button
    onClick={() =>
      navigator.clipboard.writeText(
        striptags(document.getElementById("note").innerHTML),
      )
    }
    {...props}
  >
    Copy Note
  </Button>
)

let Section = ({ header, children, Title, ...props }) => (
  <Stack bg="white" borderRadius="md" boxShadow="md" spacing="0" {...props}>
    <Flex
      bg="red.200"
      p="2"
      justifyContent="space-between"
      pos="sticky"
      top="0"
    >
      <Title />
      {header}
    </Flex>
    <Box p="3">{children}</Box>
  </Stack>
)

let noteTitle = (store) => observer(() => <b>{store.path || "<- Pick file"}</b>)

let valuePickerTitle = (store) =>
  observer(() => <b>{pathFromId(store.id) || "<- Pick field"}</b>)

let App = ({ store }) => (
  <Grid
    w="100vw"
    h="100vh"
    p="2"
    gap="2"
    bg="gray.100"
    fontFamily="monospace"
    fontSize="sm"
    gridTemplate={`
      "file-picker note value-picker" 100%
      / 20% 40% 40%
    `}
    sx={{ "> *": { overflow: "scroll" } }}
  >
    <Section
      Title={() => <b>Files</b>}
      header={<ReloadFilesButton size="xs" colorScheme="red" store={store} />}
    >
      <FilePicker store={store} gridArea="file-picker" />
    </Section>
    <Section
      Title={noteTitle(store)}
      header={<CopyNoteButton size="xs" colorScheme="red" />}
    >
      <Note store={store} gridArea="note" />
    </Section>
    <Section Title={valuePickerTitle(store)}>
      <ValuePicker store={store} gridArea="value-picker" />
    </Section>
  </Grid>
)

export default App
