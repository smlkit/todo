import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { StatusOfRequestEnum } from "../types/StatusOfRequestEnum";
import { doc, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { todos } from "../../config/firebase";
import { db } from "../../config/firebase";

export interface Todo {
  title: string;
  isDone: boolean;
  id?: string;
}

interface TodosSlice {
  fetchTodos: {
    status: StatusOfRequestEnum;
    error: string | null;
    data: Todo[];
  };
}

const initialState: TodosSlice = {
  fetchTodos: {
    status: StatusOfRequestEnum.IDLE,
    error: null,
    data: [],
  },
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.fetchTodos.status = StatusOfRequestEnum.LOADING;
        state.fetchTodos.error = null;
        state.fetchTodos.data = [];
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.fetchTodos.status = StatusOfRequestEnum.SUCCESS;
        state.fetchTodos.error = null;
        state.fetchTodos.data = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.fetchTodos.error = action.payload || "unknown error";
        state.fetchTodos.status = StatusOfRequestEnum.ERROR;
        state.fetchTodos.data = [];
      });
  },
});

export const fetchTodos = createAsyncThunk<Todo[], undefined, { rejectValue: string }>(
  "todos/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDocs(todos);
      const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(filteredData);
      return filteredData;
    } catch (error) {
      return rejectWithValue("unknown error");
    }
  }
);

export const addTodo = createAsyncThunk<void, string, { rejectValue: string }>(
  "todos/addTodo",
  async (title, { rejectWithValue }) => {
    try {
      await addDoc(todos, { title: title, isDone: false });
    } catch (error) {
      return rejectWithValue("unknown error");
    }
  }
);

export const deleteTodo = createAsyncThunk<void, string, { rejectValue: string }>(
  "todos/deleteTodo",
  async (id, { rejectWithValue }) => {
    try {
      const itemDoc = doc(db, "todos", id);
      await deleteDoc(itemDoc);
    } catch (error) {
      return rejectWithValue("unknown error");
    }
  }
);

const selfSelector = (state: RootState) => state.todos;
export const fetchTodosSelector = createSelector(selfSelector, (state) => state.fetchTodos);
export default todosSlice.reducer;
