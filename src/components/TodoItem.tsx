import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useThunkDispatch } from "../core/store/store";
import { Todo } from "../core/store/todoSlice";
import { deleteTodo, fetchTodoList, patchTodo } from "../core/store/todoSlice";
import { Checkbox, IconButton, Text, Box, Tooltip } from "@chakra-ui/react";
import { DeleteIcon, SettingsIcon } from "@chakra-ui/icons";

const TodoItem: FC<{ item: Todo }> = ({ item }) => {
  const dispatch = useThunkDispatch();
  const navigate = useNavigate();

  const onDelete = (id: string) => {
    dispatch(deleteTodo(id));
    dispatch(fetchTodoList());
  };

  const onStatus = (item: Todo) => {
    dispatch(patchTodo({ id: item.id, isDone: !item.isDone }));
    dispatch(fetchTodoList());
  };

  return (
    <Box width="300px" display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center" justifyContent="center" gap="10px">
        <Checkbox isChecked={item.isDone} onChange={() => onStatus(item)} colorScheme="teal" />

        <Tooltip label={item.dueDate ? item.dueDate.split("T")[0] : ""} placement="right" bg="grey">
          <Text as="span" overflow="hidden" textOverflow="hidden" maxWidth="200px" height="25px">
            {item.title}
          </Text>
        </Tooltip>
      </Box>
      <Box>
        <IconButton
          size="sm"
          colorScheme="red"
          variant="ghost"
          aria-label="delete item"
          icon={<DeleteIcon />}
          onClick={() => {
            if (item.id) {
              onDelete(item.id);
            }
          }}
        />
        <IconButton
          size="sm"
          colorScheme="teal"
          variant="ghost"
          aria-label="change item"
          icon={<SettingsIcon />}
          onClick={() => navigate(`/${item.id}`)}
        />
      </Box>
    </Box>
  );
};

export default TodoItem;
