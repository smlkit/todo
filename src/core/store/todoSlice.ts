import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { StatusOfRequestEnum } from "../types/StatusOfRequestEnum";
import { doc, getDocs, getDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { todos } from "../../config/firebase";
import { db } from "../../config/firebase";

export interface Todo {
  title: string;
  isDone: boolean;
  id: string;
  createdDate: number;
  dueDate: string | null;
  finishedDate: string | null;
}

interface TodosSlice {
  fetchTodoList: {
    status: StatusOfRequestEnum;
    error: string | null;
    data: Todo[];
  };
  fetchOneTodo: {
    status: StatusOfRequestEnum;
    error: string | null;
    data: Todo | null;
  };
}

const initialState: TodosSlice = {
  fetchTodoList: {
    status: StatusOfRequestEnum.IDLE,
    error: null,
    data: [],
  },
  fetchOneTodo: {
    status: StatusOfRequestEnum.IDLE,
    error: null,
    data: null,
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
      })
      .addCase(fetchOneTodo.pending, (state) => {
        state.fetchOneTodo.status = StatusOfRequestEnum.LOADING;
        state.fetchOneTodo.error = null;
      })
      .addCase(fetchOneTodo.fulfilled, (state, action) => {
        state.fetchOneTodo.status = StatusOfRequestEnum.SUCCESS;
        state.fetchOneTodo.error = null;
        state.fetchOneTodo.data = action.payload;
      })
      .addCase(fetchOneTodo.rejected, (state, action) => {
        state.fetchOneTodo.error = "unknown error";
        state.fetchOneTodo.status = StatusOfRequestEnum.ERROR;
        state.fetchOneTodo.data = null;
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

export const fetchOneTodo = createAsyncThunk<Todo | null, string, { rejectValue: string }>(
  "todos/fetchOneTodo",
  async (id, { rejectWithValue }) => {
    try {
      const docItem = doc(todos, id);
      const data = await getDoc(docItem);
      const result = data.data();
      return result ? { ...result, id: data.id } : null;
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

type PatchTodoArgs = Omit<Partial<Todo>, "id"> & Pick<Todo, "id">;

export const patchTodo = createAsyncThunk<void, PatchTodoArgs, { rejectValue: string }>(
  "todos/patchTodo",
  async (item, { rejectWithValue }) => {
    try {
      const itemDoc = doc(db, "todos", item.id);

      await updateDoc(itemDoc, item);
    } catch (error) {
      return rejectWithValue("unknown error");
    }
  }
);

const selfSelector = (state: RootState) => state.todos;
export const fetchTodoListSelector = createSelector(selfSelector, (state) => state.fetchTodoList);
export const fetchOneTodoSelector = createSelector(selfSelector, (state) => state.fetchOneTodo);
export const filterTodosSelector = createSelector(fetchTodoListSelector, ({ data, ...other }) => {
  const withDate: Todo[] = [];
  const withoutDate: Todo[] = [];
  data.forEach((el) => {
    if (el.dueDate) {
      withDate.push(el);
    } else {
      withoutDate.push(el);
    }
  });
  return { ...other, withDate, withoutDate };
});

export default todosSlice.reducer;
