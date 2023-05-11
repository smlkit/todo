import { useEffect } from "react";
import TodoItem from "../../components/TodoItem";
import { useThunkDispatch } from "../../core/store/store";
import { fetchTodoList, fetchTodoListSelector, addTodo } from "../../core/store/todoSlice";
import { useSelector } from "react-redux";
import { Button, Input, Text, Box } from "@chakra-ui/react";
import { useFormik } from "formik";
import { todoSchema } from "../../config/schemas";

const TodoPage = () => {
  const dispatch = useThunkDispatch();
  const { data: todos } = useSelector(fetchTodoListSelector);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      title: "",
      date: "",
    },
    validationSchema: todoSchema,
    onSubmit: (values, actions) => {
      const newTodo = { title: values.title, dueDate: values.date };
      dispatch(addTodo(newTodo));
      dispatch(fetchTodoList());
      actions.resetForm();
    },
  });

  useEffect(() => {
    dispatch(fetchTodoList());
  }, []);

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

        <form onSubmit={handleSubmit}>
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
              value={values.title}
              placeholder="New task..."
              id="title"
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.title && touched.title ? "input-error" : ""}
            />
            {errors.title && touched.title && (
              <Box textAlign="left" alignItems="left" width="100%">
                <Text fontSize="xs" color="#fc8181">
                  {errors.title}
                </Text>
              </Box>
            )}
            <Input
              placeholder="Select Date and Time"
              size="sm"
              type="datetime-local"
              value={values.date}
              id="date"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Button width="100px" size="sm" colorScheme="teal" type="submit">
              Add
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default TodoPage;
