import { getWipRoot, setNextUnitOfWork, setWipRoot } from "./context";
import { FibreNode, MDReactElement } from "./interface";
import { workLoop } from "./workloop";
/* Create an Element */
export function createElement(
  type: string,
  props: Object,
  ...children: any[]
): MDReactElement {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}
/* Create a Text Element */
export function createTextElement(text: string): MDReactElement {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createDom(element: FibreNode) {
  /* Create text or DOM element base on component type */
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  Object.keys(element.props)
    .filter((key: string) => key !== "children")
    .forEach((name) => {
      if (dom instanceof HTMLElement) {
        dom.setAttribute(name, element.props[name]);
      }
      if (dom instanceof Text && name === "nodeValue") {
        dom[name] = element.props[name];
      }
    });

  return dom;
}

export function render(element: MDReactElement, container: HTMLElement | Text) {
  setWipRoot({
    dom: container,
    props: {
      children: [element],
    },
  });
  setNextUnitOfWork(getWipRoot());
  requestIdleCallback(workLoop);
}
