import React, { useState } from "react";
import handleError from "../../utils/handleError";
import { useNavigate } from "react-router-dom";
const urlUsers = "http://localhost:9999/users";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorEmptyText, setErrorEmptyText] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (username == "" || password == "") {
      setErrorEmptyText(true);
    } else {
      try {
        const reponse = await fetch(
          `${urlUsers}/?username=${username}&password=${password}`
        );
        const data = await reponse.json();
        if (data.length) {
          // mảng trả về 1 đối tượng => chuyển sang trang viewtodo
          const user = data[0];
          navigate(`/viewtodos/${user.id}`, { state: user });
        } else {
          // mảng không trả về đối tượng nào => thông báo lỗi
          setErrorEmptyText(false);
          alert("Sai username hoặc password!!!");
        }
      } catch (error) {
        handleError(error.message, setError);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div
        id="login-row"
        className="row justify-content-center align-items-center"
      >
        <div id="login-column" className="col-md-6">
          <div id="login-box" className="col-md-12">
            <form>
              <h3 className="text-center">Login</h3>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <br />
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <br />
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
              </div>
              {errorEmptyText && (
                <div className="alert alert-danger" role="alert">
                  Không để trống mật khẩu hoặc username!!!
                </div>
              )}

              <div className="text-center">
                <button className="btn btn-primary col-8" onClick={handleLogin}>
                  Login
                </button>
              </div>
              {error && <p className="text-danger">Lỗi: {error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
