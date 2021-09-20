import { FibreNode } from "./interface";

interface IContext {
  wipRoot: null | FibreNode;
  nextUnitOfWork: null | FibreNode;
  currentRoot: null | FibreNode;
  deletions: Array<FibreNode>;
  wipFiber: null | FibreNode;
  hookIndex: number;
}

const context: IContext = {
  wipRoot: null,
  nextUnitOfWork: null,
  currentRoot: null,
  deletions: null,
  wipFiber: null,
  hookIndex: null,
};
export function getContext() {
  return context;
}

export function setDeletions(deletions: Array<FibreNode>) {
  context.deletions = deletions;
}

export function getDeletions() {
  return context.deletions;
}

export function getWipRoot(): FibreNode {
  return context.wipRoot;
}

export function setWipRoot(wipRoot: FibreNode) {
  context.wipRoot = wipRoot;
}

export function getWipFiber(): FibreNode {
  return context.wipFiber;
}

export function setWipFiber(wipFiber: FibreNode) {
  context.wipFiber = wipFiber;
}

export function getHookIndex(): number {
  return context.hookIndex;
}

export function setHookIndex(hookIndex: number) {
  context.hookIndex = hookIndex;
}

export function getNextUnitOfWork(): FibreNode {
  return context.nextUnitOfWork;
}

export function setNextUnitOfWork(unitOfWork: FibreNode): void {
  context.nextUnitOfWork = unitOfWork;
}

export function setCurrentRoot(currentRoot: FibreNode) {
  context.currentRoot = { ...currentRoot };
}

export function getCurrentRoot() {
  return context.currentRoot;
}
