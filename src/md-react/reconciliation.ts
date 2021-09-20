import { getDeletions } from "./context";
import { FibreNode } from "./interface";

export function reconcileChildren(wipFiber: FibreNode, elements: FibreNode[]) {
  let index = 0;
  let prevSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

  // Loop through all children and create sibling relationship.
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber: FibreNode = null;

    // Compare oldFiber to element
    const sameType = oldFiber && element && element.type == oldFiber.type;
    if (sameType) {
      // Update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }
    if (element && !sameType) {
      // Add this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }
    if (oldFiber && !sameType) {
      // Delete the oldFiber's node
      oldFiber.effectTag = "DELETION";
      getDeletions().push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      // Establish parent relationship for the 1st child
      wipFiber.child = newFiber;
    } else if (element) {
      // Create link from previous sibling to the current node
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
}
