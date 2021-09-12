import MDReact from "./md-react";

const element = MDReact.createElement("h1", { title: "foo" }, "Hello");
const container = document.getElementById("root");
MDReact.render(element, container);
