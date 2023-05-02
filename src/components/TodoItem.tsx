import { FC } from "react";
import { useThunkDispatch } from "../core/store/store";
import { Todo } from "../core/store/todoSlice";
import { deleteTodo, fetchTodos } from "../core/store/todoSlice";

const TodoItem: FC<{ item: Todo }> = ({ item }) => {
  const dispatch = useThunkDispatch();

  const onDelete = (id: string) => {
    dispatch(deleteTodo(id));
    dispatch(fetchTodos());
  };

  return (
    <>
      <input type="checkbox" checked={item.isDone} readOnly />
      <span> {item.title} </span>
      <button
        onClick={() => {
          if (item.id) {
            onDelete(item.id);
          }
        }}
      >
        delete
      </button>
    </>
  );
};

export default TodoItem;
