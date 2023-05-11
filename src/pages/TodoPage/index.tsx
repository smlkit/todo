import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TodoDetailsForm from "../../components/smart/TodoDetailsForm";
import { useThunkDispatch } from "../../core/store/store";
import { fetchOneTodo, fetchOneTodoSelector, resetFields } from "../../core/store/todoSlice";
import { Wrapper } from "../../styles/styledComponents/Wrapper";

const TodoPage = () => {
  const dispatch = useThunkDispatch();
  const { todoId } = useParams();

  useEffect(() => {
    if (todoId) {
      dispatch(resetFields());
      dispatch(fetchOneTodo(todoId));
    }
  }, []);
  const { data: todo } = useSelector(fetchOneTodoSelector);

  return <Wrapper>{todo && <TodoDetailsForm todo={todo} />}</Wrapper>;
};

export default TodoPage;
