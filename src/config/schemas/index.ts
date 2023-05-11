import * as yup from "yup";

export const todoSchema = yup.object().shape({
  title: yup.string().required("Please enter title."),
  date: yup.date(),
});
