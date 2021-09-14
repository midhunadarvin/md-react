export interface MDReactElement {
  type: string;
  props?: any;
}

export interface FibreNode {
  type?: string;
  props: any;
  parent?: FibreNode;
  child?: FibreNode;
  sibling?: FibreNode;
  dom: null | HTMLElement | Text;
  alternate?: FibreNode;
  effectTag?: string;
}
