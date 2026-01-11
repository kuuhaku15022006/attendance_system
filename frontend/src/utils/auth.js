const USERS_KEY = "demo_users";
const CURRENT_KEY = "demo_current_user";

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  return readJSON(USERS_KEY, []);
}

export function getCurrentUser() {
  return readJSON(CURRENT_KEY, null);
}

export function logout() {
  localStorage.removeItem(CURRENT_KEY);
}

export function registerUser({ username, password, role }) {
  const u = (username || "").trim();
  const p = password || "";
  const r = role || "student";

  if (!u || !p) return { ok: false, message: "Vui lòng nhập tài khoản và mật khẩu." };
  if (p.length < 4) return { ok: false, message: "Mật khẩu tối thiểu 4 ký tự." };

  const users = getUsers();
  const exists = users.some((x) => x.username.toLowerCase() === u.toLowerCase());
  if (exists) return { ok: false, message: "Tài khoản đã tồn tại." };

  users.push({ username: u, password: p, role: r });
  writeJSON(USERS_KEY, users);

  return { ok: true, message: "Đăng ký thành công. Hãy đăng nhập!" };
}

export function loginUser({ username, password }) {
  const u = (username || "").trim();
  const p = password || "";

  const users = getUsers();
  const found = users.find((x) => x.username.toLowerCase() === u.toLowerCase());

  if (!found) return { ok: false, message: "Không tìm thấy tài khoản." };
  if (found.password !== p) return { ok: false, message: "Sai mật khẩu." };

  writeJSON(CURRENT_KEY, { username: found.username, role: found.role });
  return { ok: true, message: "Đăng nhập thành công!", user: { username: found.username, role: found.role } };
}
