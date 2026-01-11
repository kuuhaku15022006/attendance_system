import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth.js";

export default function LoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg("");

    const res = loginUser({ username, password });
    if (!res.ok) {
      setMsg(res.message);
      return;
    }

    // chuyển theo role
    const role = res.user.role;
    nav(role === "teacher" ? "/teacher/classes" : "/student/classes");
  };

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Đăng nhập</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Tài khoản
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tài khoản"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <button type="submit" style={{ padding: 10, cursor: "pointer" }}>
          Đăng nhập
        </button>
      </form>

      {msg ? <p style={{ marginTop: 12 }}>{msg}</p> : null}

      <p style={{ marginTop: 12 }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}
