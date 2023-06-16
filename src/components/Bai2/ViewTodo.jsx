import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import handleError from "../../utils/handleError";
const urlTodos = "http://localhost:9999/todos";

function ViewTodo() {
  const location = useLocation();
  const [user, setUser] = React.useState(location.state); // lấy ra thông tin user đang đăng nhập
  const navigate = useNavigate();

  const [todos, setTodos] = React.useState([]);
  const [filterTodos, setFilterTodos] = React.useState([]);
  const [completed, setCompleted] = React.useState(false);
  const [error, setError] = React.useState("");

  const [keyword, setKeyword] = React.useState("");

  React.useEffect(() => {
    // sử dụng Promise
    const getData = async () => {
      try {
        const response = await fetch(`${urlTodos}?userId=${user.id}`);
        const jsonData = await response.json();
        setTodos(jsonData);
        setFilterTodos(jsonData);
      } catch (error) {
        handleError(error.message, setError);
      }
    };

    getData();
  }, []);

  const handleShowTodosByStatus = () => {
    setKeyword(""); // bỏ bộ lọc theo tên
    // tích là lọc todo đã hoàn thành, không tích là lọc những todo chưa hoàn thành
    setCompleted(!completed); // đổi lại trạng thái completed
    const filterTodos = todos.filter((item) => item.completed != completed); // lọc những việc theo trạng thái (lưu ý: completed lúc này vẫn ở trạng thái cũ (chứ chưa được set lại), dó đó phát dùng dấu (!=) để ứng với trạng thái lọc của hiện tại)
    setFilterTodos(filterTodos);
  };

  const handleSearchTodos = () => {
    setCompleted(false);
    if (!keyword) setFilterTodos(todos); // nếu không truyền keyword thị hết danh sách
    const newTodos = todos.filter((item) => item.title.includes(keyword));
    setFilterTodos(newTodos);
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-primary">
        <a href="#" className="navbar-brand font-weight-bold">
          Bài 2
        </a>
        <div>
          <span className="navbar-text text-white font-weight-bold">
            Xin chào, {user.username}
          </span>
          <button
            className="btn btn-warning mx-2 font-weight-bold"
            onClick={() => navigate("/")}
          >
            Đăng xuất
          </button>
        </div>
      </nav>
      <div className="container">
        <div className="d-flex align-items-center justify-content-center">
          <h3 className="my-4">Todo List</h3>
        </div>
        {error && <p className="text-danger">Lỗi: {error}</p>}

        <div className="d-flex align-items-start justify-content-between">
          <div className="list-group">
            <div className="form-check" style={{ marginTop: "150px" }}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={completed}
                onChange={handleShowTodosByStatus}
                id="checkbox"
              />

              <label className="form-check-label" htmlFor="checkbox">
                Uncompleted/Completed
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="title-search">Search by title</label>
            <div className="input-group mb-3 col-8">
              <input
                type="text"
                className="form-control"
                id="title-search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-describedby="basic-addon3"
              />
              <div className="input-group-append">
                <button
                  className="btn btn-success"
                  type="button"
                  id="button-addon2"
                  onClick={handleSearchTodos}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="my-4">List of todos</div>
            <table className="table" style={{ width: "800px" }}>
              <thead>
                <tr>
                  <th scope="col" style={{ textAlign: "center" }}>
                    ID
                  </th>
                  <th scope="col" style={{ width: "500px" }}>
                    Tiêu đề
                  </th>
                  <th scope="col">Username</th>
                  <th
                    scope="col"
                    style={{ textAlign: "center", whiteSpace: "nowrap" }}
                  >
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterTodos.length != 0 &&
                  filterTodos.map((item) => (
                    <tr key={item.id}>
                      <th scope="row" style={{ textAlign: "center" }}>
                        {item.id}
                      </th>
                      <td>{item.title}</td>
                      <td> {user.username} </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={item.completed}
                          readOnly
                          aria-label="Checkbox for following text input"
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          style={{
            position: "fixed",
            bottom: "0",
            right: "0",
            left: "0",
            textAlign: "center",
          }}
        >
          @Copyright by
        </div>
      </div>
    </>
  );
}

export default ViewTodo;
