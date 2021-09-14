import MDReact from "./md-react";

function App(props: any) {
  return MDReact.createElement("h1", null, "Hi, ", props.name);
}

const container = document.getElementById("root");
MDReact.render(App({ name: "Hello world" }), container);
