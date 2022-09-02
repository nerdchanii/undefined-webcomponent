import { Node } from "./types";
import { transToDom } from "./transToDom";

export const render = (node: Node, container: HTMLElement) => {
  const dom = transToDom(node);
  container.appendChild(dom);
};
