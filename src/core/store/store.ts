import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import todosReducer from "./todoSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useThunkDispatch = () => useDispatch<typeof store.dispatch>();
