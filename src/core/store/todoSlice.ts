import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { StatusOfRequestEnum } from "../types/StatusOfRequestEnum";
import { doc, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { todos } from "../../config/firebase";
import { db } from "../../config/firebase";

export interface Todo {
  title: string;
  isDone: boolean;
  id: string;
  createdDate: number;
  dueDate: string;
  finishedDate: string | null;
}

interface TodosSlice {
  fetchTodoList: {
    status: StatusOfRequestEnum;
    error: string | null;
    data: Todo[];
  };
}

const initialState: TodosSlice = {
  fetchTodoList: {
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
      .addCase(fetchTodoList.pending, (state) => {
        state.fetchTodoList.status = StatusOfRequestEnum.LOADING;
        state.fetchTodoList.error = null;
      })
      .addCase(fetchTodoList.fulfilled, (state, action) => {
        state.fetchTodoList.status = StatusOfRequestEnum.SUCCESS;
        state.fetchTodoList.error = null;
        state.fetchTodoList.data = action.payload;
      })
      .addCase(fetchTodoList.rejected, (state, action) => {
        state.fetchTodoList.error = action.payload || "unknown error";
        state.fetchTodoList.status = StatusOfRequestEnum.ERROR;
        state.fetchTodoList.data = [];
      });
  },
});

export const fetchTodoList = createAsyncThunk<Todo[], undefined, { rejectValue: string }>(
  "todos/fetchTodoList",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDocs(todos);
      const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const sortedData = filteredData.sort((a, b) => a.createdDate - b.createdDate);
      return sortedData;
    } catch (error) {
      return rejectWithValue("unknown error");
    }
  }
);

export const addTodo = createAsyncThunk<void, { title: string; dueDate: string }, { rejectValue: string }>(
  "todos/addTodo",
  async (item, { rejectWithValue }) => {
    try {
      const docItem = doc(todos);
      await addDoc(todos, {
        title: item.title,
        isDone: false,
        id: docItem.id,
        createdDate: Date.now(),
        dueDate: item.dueDate,
        finishedDate: null,
      });
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

export const updateStatus = createAsyncThunk<void, Todo, { rejectValue: string }>(
  "todos/updateStatus",
  async (item, { rejectWithValue }) => {
    try {
      const itemDoc = doc(db, "todos", item.id);
      await updateDoc(itemDoc, { isDone: !item.isDone, finishedDate: Date.now() });
    } catch (error) {
      return rejectWithValue("unknown error");
    }
  }
);

export const updateDueDate = createAsyncThunk<
  void,
  { id: string; newDueDate: string },
  { rejectValue: string }
>("todos/updateDueDate", async (id, newDueDate, { rejectWithValue }) => {
  try {
    const itemDoc = doc(db, "todos", id);
    await updateDoc(itemDoc, { dueDate: newDueDate });
  } catch (error) {
    return rejectWithValue("unknown error");
  }
});

const selfSelector = (state: RootState) => state.todos;
export const fetchTodoListSelector = createSelector(selfSelector, (state) => state.fetchTodoList);
export default todosSlice.reducer;
