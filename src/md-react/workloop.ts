import {
  getDeletions,
  getNextUnitOfWork,
  getWipRoot,
  setCurrentRoot,
  setNextUnitOfWork,
  setWipRoot,
} from "./context";
import { FibreNode } from "./interface";
import {
  updateDom,
  updateFunctionComponent,
  updateHostComponent,
} from "./utils";

interface Deadline {
  timeRemaining: () => number;
}

/**
 * Once we start rendering, we won’t stop until we have rendered the complete element tree.
 * If the element tree is big, it may block the main thread for too long. And if the browser needs to do high priority
 * stuff like handling user input or keeping an animation smooth, it will have to wait until the render finishes.
 *
 * This function divides the work into smaller chunks so that it doesn't block the call stack.
 * We use requestIdleCallback to sequence/queue each unit of work.
 */
export function workLoop(deadline: Deadline) {
  let shouldYield = false;

  /* The initial unit of work would be the root node */
  const nextUnitOfWork = getNextUnitOfWork();
  while (nextUnitOfWork && !shouldYield) {
    setNextUnitOfWork(performUnitOfWork(nextUnitOfWork));
    shouldYield = deadline.timeRemaining() < 1;
  }

  // If there are no more units of work to be done. We can commit our changes (work in progress root) to the DOM.
  if (!nextUnitOfWork && getWipRoot()) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

/**
 * This function performs the unit of work and returns the
 * next unit of work. It will return either the child or sibling.
 *
 * If child or sibling is not there, it will go to it's parent and keep checking
 * once it reaches the root, it will return undefined. i.e nextUnitOfWork is not there
 *
 * Each unit of work involves either creating the dom if doesn't exist for that particular
 * node, and reconciling it's children.
 */
function performUnitOfWork(fiber: FibreNode) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // Return the next unit of work (next fibre node)
  if (fiber.child) {
    // If child exists, go to the child.
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      // If sibling exists, go to the sibling.
      return nextFiber.sibling;
    }
    // else go to parent
    nextFiber = nextFiber.parent;
  }
}

export function commitRoot() {
  getDeletions().forEach(commitWork);

  // Get the current work in progress root
  const wipRoot = getWipRoot();
  // Commit the changes to the DOM.
  commitWork(wipRoot.child);

  // Save the current work in progress root, so that it can be serve as a
  // referrence to compare the changes between state updates.
  setCurrentRoot(wipRoot);

  // Make the work in progress root to be null, to be reused in the next cycle.
  setWipRoot(null);
}

function commitWork(fiber: FibreNode) {
  if (!fiber) {
    return;
  }

  // To find the parent of a DOM node we’ll need to go up the fiber tree until we find a fiber with a DOM node.
  // In case of function components, they won't have a dom
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber: FibreNode, domParent: HTMLElement | Text) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else if (fiber) {
    commitDeletion(fiber.child, domParent);
  }
}
