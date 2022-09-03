import { Children, Node } from "../../core/types";
import { createNode } from "../../core/createNode";

export function span(children: Children, props?: any): Node {
  return createNode({
    type: "span",
    props,
    children,
  });
}
