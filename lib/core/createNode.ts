import { Node } from "./types";

export const createNode = ({ type, props, children }: Node) => {
  return {
    type,
    props: props || {},
    children: children.flat(),
  };
};
