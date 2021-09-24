/** @jsx MDReact.createElement */
/**
 * The above comment tells jsx to use MDReact.createElement
 * function rather than the React.createElement function, to
 * compile the jsx into.
 */
import MDReact from "./md-react";

/**
 * Simple Counter component that will increment the counter as
 * the user clicks on it.
 */
function Counter() {
  const [state, setState] = MDReact.useState(1);
  return <h1 onClick={() => setState((c: number) => c + 1)}>Count: {state}</h1>;
}

const element = <Counter />;
const container = document.getElementById("root");
MDReact.render(element, container);
