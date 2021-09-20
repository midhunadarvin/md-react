import {
  getCurrentRoot,
  getHookIndex,
  getWipFiber,
  getWipRoot,
  setDeletions,
  setHookIndex,
  setNextUnitOfWork,
  setWipRoot,
} from "./context";

export function useState(initial: any) {
  const wipFiber = getWipFiber();
  const hookIndex = getHookIndex();
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook: any = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action: any) => {
    hook.state = action(hook.state);
  });

  const setState = (action: any) => {
    hook.queue.push(action);
    const currentRoot = getCurrentRoot();
    // Trigger the render.
    setWipRoot({
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    });
    setNextUnitOfWork(getWipRoot());
    setDeletions([]);
  };

  wipFiber.hooks.push(hook);
  setHookIndex(hookIndex + 1);
  return [hook.state, setState];
}
