import { getWipFiber, setHookIndex, setWipFiber } from "./context";
import { FibreNode, MDReactElement } from "./interface";
import { reconcileChildren } from "./reconciliation";
/* Create an Element */
export function createElement(
  type: string,
  props: Object,
  ...children: any[]
): MDReactElement {
  const childrenResult: any = [];
  children.forEach((child) => {
    if (Array.isArray(child)) {
      childrenResult.push(...child);
    } else if (typeof child === "object") {
      childrenResult.push(child);
    } else {
      childrenResult.push(createTextElement(child));
    }
  });
  return {
    type,
    props: {
      ...props,
      children: childrenResult,
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
      : document.createElement(element.type as string);

  updateDom(dom, {}, element.props);

  return dom;
}

const isEvent = (key: string) => key.startsWith("on");
const isProperty = (key: string) => key !== "children" && !isEvent(key);
const isNew = (prev: any, next: any) => (key: string) =>
  prev[key] !== next[key];
const isGone = (prev: any, next: any) => (key: string) => !(key in next);

export function updateDom(dom: any, prevProps: any, nextProps: any) {
  //Remove old or changed event listeners
  if (prevProps) {
    Object.keys(prevProps)
      .filter(isEvent)
      .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
      .forEach((name) => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
      });
  }
  // Remove old properties
  if (prevProps) {
    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone(prevProps, nextProps))
      .forEach((name) => {
        dom[name] = "";
      });
  }
  // Set new or changed properties
  if (nextProps) {
    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, nextProps))
      .forEach((name) => {
        dom[name] = nextProps[name];
      });
  }
  // Add event listeners
  if (nextProps) {
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach((name) => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
      });
  }
}

export function updateHostComponent(fiber: FibreNode) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.props && fiber.props.children) {
    reconcileChildren(fiber, fiber.props.children);
  }
}

export function updateFunctionComponent(fiber: FibreNode) {
  if (fiber.type instanceof Function) {
    setWipFiber(fiber);
    setHookIndex(0);
    getWipFiber().hooks = [];
    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
  }
}
