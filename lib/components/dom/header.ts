import { createNode } from "../../core/createNode";
import { Children } from "../../core/types";

export function header(children: Children, props?: any) {
  return createNode({
    type: "header",
    props,
    children,
  });
}
