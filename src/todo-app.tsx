/** @jsx MDReact.createElement */
import MDReact from "./md-react";

/**
 * A Simple TODO Application
 */
export default function TodoApp() {
  const [todos, setTodos] = MDReact.useState([]);

  const addTodo = () => {
    const textInputValue = (
      document.getElementById("todo-input") as HTMLInputElement
    ).value;
    setTodos([...todos, textInputValue]);
    (document.getElementById("todo-input") as HTMLInputElement).value = "";
  };

  return (
    <div>
      <h1>TODO Application</h1>
      <ul>
        {todos.map((item: string) => (
          <li>{item}</li>
        ))}
      </ul>
      <div>
        <input id="todo-input" />
        <button onClick={addTodo}>Add TODO</button>
      </div>
    </div>
  );
}
