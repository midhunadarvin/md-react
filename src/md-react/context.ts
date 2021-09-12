import { FibreNode } from "./interface";

interface IContext {
  wipRoot: null | FibreNode;
  nextUnitOfWork: null | FibreNode;
}

const context: IContext = {
  wipRoot: null,
  nextUnitOfWork: null,
};
export function getContext() {
  return context;
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
