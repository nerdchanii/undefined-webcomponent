import { Children } from "../../core/types";
import { createNode } from "../../core/createNode";

export function a(children: Children, props?: any) {
  return createNode({
    type: "a",
    props: props,
    children: children,
  });
}
