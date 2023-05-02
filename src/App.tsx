import "./App.css";
import { useEffect, useState } from "react";
import { db } from "./config/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import TodoItem from "./components/TodoItem";
import { useThunkDispatch } from "./core/store/store";
import { fetchTodos, fetchTodosSelector, addTodo } from "./core/store/todoSlice";
import { useSelector } from "react-redux";

function App() {
  const dispatch = useThunkDispatch();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const { data: todos, status, error } = useSelector(fetchTodosSelector);

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  const addPost = () => {
    dispatch(addTodo(newTodoTitle));
    dispatch(fetchTodos());
    setNewTodoTitle("");
  };

  return (
    <div>
      <p>ToDo List</p>
      <hr />
      <div>
        {todos.map((item) => (
          <div key={item.id}>{<TodoItem item={item} />}</div>
        ))}
      </div>

      <input type="text" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} />
      <button onClick={addPost}>Add</button>
    </div>
  );
}

export default App;
