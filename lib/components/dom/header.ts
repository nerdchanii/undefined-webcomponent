import { createNode } from "../../core/createNode";

export function header(node: Node[], props: any) {
  return createNode({
    type: "header",
    props: props,
    children: node,
  });
}
