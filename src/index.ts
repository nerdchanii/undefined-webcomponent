import { createNode } from "../lib/core/createNode";
import { render } from "../lib/core/render";
import App from "./App";

const Root = createNode({
  type: "div",
  props: {
    id: "index",
  },
  children: [App],
});

render(Root, document.getElementById("root")!);
