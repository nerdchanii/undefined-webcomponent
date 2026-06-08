import type { CheapChild, CheapElement } from "../model/types";

export function render(child: CheapChild, root: ParentNode) {
  root.appendChild(toDom(child));
}

export function toDom(child: CheapChild): Node {
  if (child == null || typeof child === "boolean") {
    return document.createTextNode("");
  }

  if (typeof child === "string" || typeof child === "number") {
    return document.createTextNode(String(child));
  }

  if (typeof child.type === "function") {
    return toDom(child.type({ ...child.props, children: child.children }));
  }

  return elementToDom(child);
}

function elementToDom(element: CheapElement): Element {
  const type = element.type;

  if (typeof type !== "string") {
    return toDom(type({ ...element.props, children: element.children })) as Element;
  }

  const dom = document.createElement(type);

  for (const [name, value] of Object.entries(element.props)) {
    if (value == null) {
      continue;
    }

    if (name === "className") {
      dom.setAttribute("class", String(value));
      continue;
    }

    dom.setAttribute(name, String(value));
  }

  for (const child of element.children) {
    dom.appendChild(toDom(child));
  }

  return dom;
}
