export type Node = {
  type: string;
  props?: { [key: string]: any };
  children: any[];
};

export type Children = Array<Node | string>;
