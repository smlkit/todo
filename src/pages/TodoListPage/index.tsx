import { useEffect, useState } from "react";
import TodoItem from "../../components/TodoItem";
import { useThunkDispatch } from "../../core/store/store";
import { fetchTodoList, fetchTodoListSelector, addTodo } from "../../core/store/todoSlice";
import { useSelector } from "react-redux";
import { Button, Input, Text, Box } from "@chakra-ui/react";
import { StatusOfRequestEnum } from "../../core/types/StatusOfRequestEnum";

const TodoPage = () => {
  const dispatch = useThunkDispatch();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDate, setNewTodoDate] = useState("");
  const { data: todos, status, error } = useSelector(fetchTodoListSelector);

  useEffect(() => {
    dispatch(fetchTodoList());
  }, []);

  const onAdd = () => {
    if (newTodoTitle) {
      const newTodo = { title: newTodoTitle, dueDate: newTodoDate };
      dispatch(addTodo(newTodo));
      dispatch(fetchTodoList());
      setNewTodoTitle("");
      setNewTodoDate("");
    }
  };

  return (
    <Box display="flex" alignItems="center" flexDirection="column" paddingTop="30px">
      <Box
        width="500px"
        borderWidth="1px"
        borderRadius="lg"
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Text fontSize="3xl" as="b" paddingBottom="20px" paddingTop="30px">
          ToDo List
        </Text>
        <Box paddingBottom="20px">
          {todos.map((item) => (
            <div key={item.id}>{<TodoItem item={item} />}</div>
          ))}
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          gap="10px"
          alignItems="center"
          paddingBottom="40px"
          width="300px"
        >
          <Input
            size="sm"
            width="300px"
            value={newTodoTitle}
            placeholder="New task..."
            onChange={(e) => setNewTodoTitle(e.target.value)}
          />
          <Input
            placeholder="Select Date and Time"
            size="sm"
            type="datetime-local"
            value={newTodoDate}
            onChange={(e) => setNewTodoDate(e.target.value)}
          />
          <Button
            isLoading={status === StatusOfRequestEnum.LOADING ? true : false}
            width="100px"
            onClick={onAdd}
            size="sm"
          >
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TodoPage;
