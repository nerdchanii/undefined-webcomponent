import { createNode } from "../../core/createNode";

export const div = (nodes: any[], props?: any) => {
  return createNode({
    type: "div",
    props: props,
    children: nodes,
  });
};
