import {
  getCurrentRoot,
  getWipRoot,
  setDeletions,
  setNextUnitOfWork,
  setWipRoot,
} from "./context";
import { MDReactElement } from "./interface";
import { workLoop } from "./workloop";

export function render(element: MDReactElement, container: HTMLElement | Text) {
  // Set the work in progress root as the container element, along with
  // it's props, and an alternate root (which would be the previous state)
  setWipRoot({
    dom: container,
    props: {
      children: [element],
    },
    alternate: getCurrentRoot(),
  });
  setDeletions([]);
  setNextUnitOfWork(getWipRoot());
  requestIdleCallback(workLoop);
}
