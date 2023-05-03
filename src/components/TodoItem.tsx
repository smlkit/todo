import { FC } from "react";
import { useThunkDispatch } from "../core/store/store";
import { Todo } from "../core/store/todoSlice";
import { deleteTodo, fetchTodoList, updateStatus } from "../core/store/todoSlice";
import { Checkbox, IconButton, Text, Box, Tooltip } from "@chakra-ui/react";
import { DeleteIcon, SettingsIcon } from "@chakra-ui/icons";

const TodoItem: FC<{ item: Todo }> = ({ item }) => {
  const dispatch = useThunkDispatch();

  const onDelete = (id: string) => {
    dispatch(deleteTodo(id));
    dispatch(fetchTodoList());
  };

  const onStatus = (item: Todo) => {
    dispatch(updateStatus(item));
    dispatch(fetchTodoList());
  };

  return (
    <Box width="300px" display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center" justifyContent="center" gap="10px">
        <Checkbox isChecked={item.isDone} onChange={() => onStatus(item)} colorScheme="teal" />
        <Tooltip label={item.dueDate} placement="right" bg="grey">
          <Text as="span">{item.title}</Text>
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
        />
      </Box>
    </Box>
  );
};

export default TodoItem;
