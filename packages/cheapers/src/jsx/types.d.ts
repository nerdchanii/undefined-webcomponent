import type { CheapElement } from "../model/types";

declare global {
  namespace JSX {
    type Element = CheapElement;

    interface IntrinsicElements extends NativeElements {}
  }
}

type NativeElements = {
  [K in keyof HTMLElementTagNameMap]: Record<string, unknown>;
};
