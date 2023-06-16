import React from "react";
import handleError from "../../utils/handleError";
const urlTodos = "http://localhost:9999/todos";
const urlUsers = "http://localhost:9999/users";

const TodosList = () => {
  const [todos, setTodos] = React.useState([]);
  const [filterTodos, setFilterTodos] = React.useState([]);
  const [currentUserId, setCurrentUserId] = React.useState();
  const [users, setUsers] = React.useState([]);
  const [keyword, setKeyword] = React.useState("");

  const [error, setError] = React.useState("");

  React.useEffect(() => {
    // sử dụng Promise
    const getData = async () => {
      try {
        const response = await Promise.all([fetch(urlTodos), fetch(urlUsers)]);
        const [todosList, userList] = response;

        const todosData = await todosList.json();
        const usersData = await userList.json();

        setTodos(todosData);
        setFilterTodos(todosData);
        setUsers(usersData);
      } catch (error) {
        handleError(error.message, setError);
      }
    };

    getData();
  }, []);

  const handleShowTodosByUser = (event, userId) => {
    event.preventDefault();
    setKeyword(""); // bỏ filter theo title
    setCurrentUserId(userId);
    setFilterTodos((prev) => {
      const newTodos = todos.filter((item) => item.userId == userId);
      return newTodos;
    });
  };

  const getUsernameByUserId = (id) => {
    const user = users.find((item) => item.id == id);
    return user.username;
  };

  const handleSearchTodos = () => {
    setCurrentUserId(null); // bỏ trạng thái lọc theo tên
    if (!keyword) setFilterTodos(todos); // nếu không truyền keyword thị hết danh sách
    const newTodos = todos.filter((item) => item.title.includes(keyword));
    setFilterTodos(newTodos);
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-center">
        <h3 className="my-4">Todo List</h3>
      </div>
      {error && <p className="text-danger">Lỗi: {error}</p>}

      <div className="d-flex align-items-start justify-content-between">
        <div className="list-group">
          {users.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`list-group-item list-group-item-action ${
                item.id == currentUserId ? "active" : ""
              }`}
              onClick={(e) => handleShowTodosByUser(e, item.id)}
            >
              {item.username}
            </a>
          ))}
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
          <table className="table" style={{ width: "900px" }}>
            <thead>
              <tr>
                <th scope="col" style={{ textAlign: "center" }}>
                  ID
                </th>
                <th scope="col" style={{ width: "600px" }}>
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
                users.length != 0 &&
                filterTodos.map((item) => (
                  <tr key={item.id}>
                    <th scope="row" style={{ textAlign: "center" }}>
                      {item.id}
                    </th>
                    <td>{item.title}</td>
                    <td> {getUsernameByUserId(item.userId)} </td>
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
  );
};

export default TodosList;
