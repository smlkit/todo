import { FC } from "react";
import { useThunkDispatch } from "../../../core/store/store";
import { Todo, patchTodo } from "../../../core/store/todoSlice";
import { useFormik } from "formik";
import { todoSchema } from "../../../config/schemas";
import { Box, Input, Text, Button } from "@chakra-ui/react";
import moment from "moment";

const TodoDetailsForm: FC<{ todo: Todo }> = ({ todo }) => {
  const dispatch = useThunkDispatch();
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      title: todo.title,
      date: moment(todo.dueDate).format("YYYY-MM-DDThh:mm"),
    },
    validationSchema: todoSchema,
    onSubmit: (values, actions) => {
      if (todo) {
        dispatch(patchTodo({ id: todo.id, dueDate: values.date, title: values.title }));
      }
    },
  });

  return (
    <form onSubmit={handleSubmit}>
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
            {errors.title && touched.title && (
              <Box textAlign="left" alignItems="left" width="100%">
                <Text fontSize="xs" color="#fc8181">
                  {errors.title}
                </Text>
              </Box>
            )}

            <Input
              id="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.title && touched.title ? "input-error" : ""}
              mb={5}
            />

            <Input
              id="date"
              value={values.date}
              onChange={handleChange}
              size="md"
              type="datetime-local"
              mb={5}
            />
            <Button type="submit" width="100px" colorScheme="teal" size="md">
              Update
            </Button>
          </>
        )}
      </Box>
    </form>
  );
};

export default TodoDetailsForm;
