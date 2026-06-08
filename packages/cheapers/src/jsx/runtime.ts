import type { CheapChild, CheapElement } from "../model/types";

export function jsx(type: CheapElement["type"], props: any, key?: any) {
  return h(type, props, key);
}

export { jsx as jsxs };

export function h(
  type: CheapElement["type"],
  props: Record<string, unknown> | null,
  key?: string | number | null
): CheapElement {
  const normalizedProps = props || {};
  const { children, ...restProps } = normalizedProps;

  return {
    type,
    props: restProps,
    key: key ?? null,
    children: normalizeChildren(children),
  };
}

function normalizeChildren(children: unknown): CheapChild[] {
  if (children == null) {
    return [];
  }

  return Array.isArray(children) ? children.flat() : [children as CheapChild];
}
