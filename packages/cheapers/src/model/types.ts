export type CheapComponent<P = any> = (props: P) => CheapChild;

export type CheapChild =
  | CheapElement
  | string
  | number
  | boolean
  | null
  | undefined;

export interface CheapElement {
  type: string | CheapComponent;
  props: Record<string, unknown>;
  key: string | number | null;
  children: CheapChild[];
}
