import { createNode } from "../../core/createNode";
import { Children } from "../../core/types";

export const div = (children: Children, props?: any) => {
  return createNode({
    type: "div",
    props,
    children,
  });
};
