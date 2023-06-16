import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Bai1 from "./components/Bai1";
import Login from "./components/Bai2/Login";
import ViewTodo from "./components/Bai2/ViewTodo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/viewtodos/:userId",
    element: <ViewTodo />,
  },
]);

function App() {
  return (
    <div className="App">
      <Bai1 />
      {/* Bỏ comment dưới để chạy bài 2 */}
      {/* <RouterProvider router={router} /> */}
    </div>
  );
}

export default App;
