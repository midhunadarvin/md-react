/** @jsx MDReact.createElement */
import MDReact from "./md-react";

function Counter() {
  const [state, setState] = MDReact.useState(1);
  return <h1 onClick={() => setState((c: number) => c + 1)}>Count: {state}</h1>;
}
const element = <Counter />;
const container = document.getElementById("root");
MDReact.render(element, container);
