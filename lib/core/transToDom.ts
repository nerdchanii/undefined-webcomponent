import { Node } from "./types";

export const transToDom = (node: Node) => {
  const { type, props, children } = node;
  const dom = document.createElement(type);
  for (let key in props) {
    dom?.setAttribute(key, props[key]);
  }
  children.forEach((child) => {
    if (typeof child === "string") {
      dom.appendChild(document.createTextNode(child));
    } else {
      dom.appendChild(transToDom(child));
    }
  });
  return dom;
};
