import { getDeletions } from "./context";
import { FibreNode } from "./interface";

/**
 * This function will either create the relationship between the
 * work in progress fiber node and it's children. It will also compare
 * between the previous fiber, and take the corresponding action based
 * on the differences (placement, update, delete)
 *
 * @param wipFiber
 * @param elements
 */
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

    /**
     *  If the previous node and new node are of the same type, we can reuse the
     *  same dom element, just need to update the props .
     */
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
    /**
     *  If the previous node and new node are not of same type, and there
     *  is a new node element, we need to add this element
     */
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
    /**
     * If the previous node and new node are not of same type, we need to
     * delete the old element.
     */
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
