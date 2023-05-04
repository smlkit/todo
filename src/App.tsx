import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoListPage from "./pages/TodoListPage";
import TodoPage from "./pages/TodoPage";
import CalendarPage from "./pages/CalendarPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/" element={<TodoListPage />}></Route>
          <Route path="/:todoId" element={<TodoPage />}></Route>
          <Route path="/calendar" element={<CalendarPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
