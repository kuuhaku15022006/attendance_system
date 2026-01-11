import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../utils/auth.js";

export default function RegisterPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg("");

    if (password !== confirm) {
      setMsg("Mật khẩu nhập lại không khớp.");
      return;
    }

    const res = registerUser({ username, password, role });
    setMsg(res.message);

    if (res.ok) {
      // về login sau 600ms cho người dùng thấy thông báo
      setTimeout(() => nav("/login"), 600);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Đăng ký</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Tài khoản
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="vd: duykawaii"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Vai trò
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>

        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Nhập lại mật khẩu
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <button type="submit" style={{ padding: 10, cursor: "pointer" }}>
          Đăng ký
        </button>
      </form>

      {msg ? <p style={{ marginTop: 12 }}>{msg}</p> : null}

      <p style={{ marginTop: 12 }}>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}
