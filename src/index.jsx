import _ from "lodash/fp"
import React from "react"
import ReactDOM from "react-dom"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { onSnapshot, getSnapshot, unprotect } from "mobx-state-tree"
import App from "./App"
import model from "./model"

let storage = window.localStorage

let store = model.create(JSON.parse(storage.getItem("store")) || undefined)

unprotect(store)

onSnapshot(store, (x) => storage.setItem("store", JSON.stringify(x)))


ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App store={store} />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root"),
)
