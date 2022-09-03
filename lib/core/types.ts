export type Node = {
  type: string;
  props?: { [key: string]: any };
  children: Array<Node | string>;
};

export type Children = Array<Node | string>;
