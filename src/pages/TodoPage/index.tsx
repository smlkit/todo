import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useThunkDispatch } from "../../core/store/store";
import { fetchOneTodo, fetchOneTodoSelector, patchTodo } from "../../core/store/todoSlice";
import { Box, Input, Text, Button } from "@chakra-ui/react";
import { StatusOfRequestEnum } from "../../core/types/StatusOfRequestEnum";
import moment from "moment";

const TodoPage = () => {
  const navigate = useNavigate();
  const dispatch = useThunkDispatch();
  const { todoId } = useParams();
  const { data: todo, status, error } = useSelector(fetchOneTodoSelector);

  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDate, setNewTodoDate] = useState("");

  useEffect(() => {
    if (todoId) {
      dispatch(fetchOneTodo(todoId));
    }
  }, []);

  useEffect(() => {
    if (todo && status === StatusOfRequestEnum.SUCCESS) {
      setNewTodoDate(todo.dueDate);
      setNewTodoTitle(todo.title);
    }
  }, [status]);

  const onUpdate = () => {
    if (todo && newTodoTitle && newTodoDate) {
      console.log(`upd btn`);
      dispatch(patchTodo({ id: todo.id, dueDate: newTodoDate, title: newTodoTitle }));
    }
  };

  return (
    <Box>
      <Text as="b">Change todo</Text>
      {todo && (
        <>
          <Input value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} />
          <Input
            placeholder="Select Date and Time"
            size="sm"
            type="datetime-local"
            value={moment(newTodoDate).format("YYYY-MM-DDThh:mm")}
            onChange={(e) => setNewTodoDate(e.target.value)}
          />
          <Button width="100px" onClick={onUpdate} colorScheme="teal" size="sm">
            Update
          </Button>
        </>
      )}
    </Box>
  );
};

export default TodoPage;
