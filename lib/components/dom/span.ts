import { Node } from "../../core/types";
import { createNode } from "../../core/createNode";

export function span(nodes: any[], props?: any): Node {
  if (typeof nodes === "string") {
    return createNode({
      type: "span",
      props: props,
      children: [nodes],
    });
  }
  return createNode({
    type: "span",
    props: props,
    children: nodes,
  });
}
