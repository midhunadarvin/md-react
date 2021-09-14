import { FibreNode } from "./interface";

interface IContext {
  wipRoot: null | FibreNode;
  nextUnitOfWork: null | FibreNode;
  currentWipRoot: null | FibreNode;
  deletions: Array<FibreNode>;
}

const context: IContext = {
  wipRoot: null,
  nextUnitOfWork: null,
  currentWipRoot: null,
  deletions: null,
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

export function getNextUnitOfWork(): FibreNode {
  return context.nextUnitOfWork;
}

export function setNextUnitOfWork(unitOfWork: FibreNode): void {
  context.nextUnitOfWork = unitOfWork;
}

export function setCurrentWipRoot(currentWipRoot: FibreNode) {
  context.currentWipRoot = { ...currentWipRoot };
}

export function getCurrentWipRoot() {
  return context.currentWipRoot;
}
