import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useThunkDispatch } from "../../core/store/store";
import { fetchOneTodo, fetchOneTodoSelector, patchTodo } from "../../core/store/todoSlice";
import { Box, Input, Text, Button } from "@chakra-ui/react";
import { StatusOfRequestEnum } from "../../core/types/StatusOfRequestEnum";
import moment from "moment";
import { Wrapper } from "../../styles/styledComponents/Wrapper";

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
    if (todo && todo.dueDate && status === StatusOfRequestEnum.SUCCESS) {
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
    <Wrapper>
      <Box
        p="40px"
        width="500px"
        borderWidth="1px"
        borderRadius="lg"
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Text as="b" pb={5} fontSize="xl">
          Change todo details
        </Text>
        {todo && (
          <>
            <Input value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} mb={5} />
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
              value={moment(newTodoDate).format("YYYY-MM-DDThh:mm")}
              onChange={(e) => setNewTodoDate(e.target.value)}
              mb={5}
            />
            <Button width="100px" onClick={onUpdate} colorScheme="teal" size="md">
              Update
            </Button>
          </>
        )}
      </Box>
    </Wrapper>
  );
};

export default TodoPage;
