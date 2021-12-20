import { directoryOpen } from "browser-fs-access"

export let readFiles = async ({ filter, ...options }) => {
  let files = await directoryOpen(options)
  if (filter) files = files.filter((file) => filter(file.name))
  let promises = files.map(async (file) => {
    file.data = new TextDecoder().decode(await file.arrayBuffer())
  })
  await Promise.all(promises)
  return files
}
