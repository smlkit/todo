import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoPage from "./pages/TodoPage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoPage />}></Route>
        <Route path="/calendar" element={<CalendarPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
