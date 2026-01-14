import React, { useMemo, useState } from "react";

/* ====== CONSTANTS ====== */
const DAYS = [
  { value: "MON", label: "Thứ 2" },
  { value: "TUE", label: "Thứ 3" },
  { value: "WED", label: "Thứ 4" },
  { value: "THU", label: "Thứ 5" },
  { value: "FRI", label: "Thứ 6" },
  { value: "SAT", label: "Thứ 7" },
  { value: "SUN", label: "Chủ nhật" },
];

const PERIODS = [1, 2, 3, 4];

function dayLabel(value) {
  return DAYS.find((d) => d.value === value)?.label ?? value;
}

function normalizeCode(code) {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

/* ====== PAGE ====== */
export default function TeacherClassesPage() {
  // ✅ KHÔNG DEMO
  const [classes, setClasses] = useState([]);

  // Search
  const [query, setQuery] = useState("");

  // Modal create
  const [open, setOpen] = useState(false);

  // Form create
  const [form, setForm] = useState({
    subjectName: "",
    subjectCode: "",
    teacherName: "",
    dayOfWeek: "MON",
    period: 1,
  });

  const [errors, setErrors] = useState({});

  /* ====== FILTER SEARCH ====== */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return classes;

    return classes.filter((c) => {
      const name = (c.subjectName || "").toLowerCase();
      const code = (c.subjectCode || "").toLowerCase();
      const teacher = (c.teacherName || "").toLowerCase();
      return name.includes(q) || code.includes(q) || teacher.includes(q);
    });
  }, [classes, query]);

  /* ====== VALIDATION ====== */
  function validate(nextForm) {
    const e = {};
    if (!nextForm.subjectName.trim()) e.subjectName = "Vui lòng nhập tên môn học.";
    if (!nextForm.subjectCode.trim()) e.subjectCode = "Vui lòng nhập mã môn.";
    if (!nextForm.teacherName.trim()) e.teacherName = "Vui lòng nhập tên giảng viên.";

    const code = normalizeCode(nextForm.subjectCode);
    if (classes.some((c) => c.subjectCode === code)) {
      e.subjectCode = "Mã môn đã tồn tại.";
    }
    return e;
  }

  function resetForm() {
    setForm({
      subjectName: "",
      subjectCode: "",
      teacherName: "",
      dayOfWeek: "MON",
      period: 1,
    });
    setErrors({});
  }

  function closeModal() {
    setOpen(false);
    resetForm();
  }

  function submit(e) {
    e.preventDefault();

    const nextForm = {
      subjectName: form.subjectName.trim(),
      subjectCode: normalizeCode(form.subjectCode),
      teacherName: form.teacherName.trim(),
      dayOfWeek: form.dayOfWeek,
      period: Number(form.period),
    };

    const eMap = validate(nextForm);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    setClasses((prev) => [{ id: crypto.randomUUID(), ...nextForm }, ...prev]);
    closeModal();
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 6 }}>Teacher Classes</h1>
      <div style={{ color: "#555", marginBottom: 16 }}>
        Tạo class và tìm kiếm môn (lọc theo tên môn / mã môn / giảng viên)
      </div>

      {/* ====== TOP ACTIONS ====== */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        {/* Search */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên môn / mã môn / giảng viên..."
          style={{ padding: 10, width: 360, border: "1px solid #ccc", borderRadius: 8 }}
        />

        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        ) : null}

        {/* Create */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          + Tạo class
        </button>
      </div>

      {/* ====== STATS ====== */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <Stat label="Tổng lớp" value={classes.length} />
        <Stat label="Đang hiển thị" value={filtered.length} />
        <Stat label="Ca học" value="1–4" />
      </div>

      {/* ====== LIST ====== */}
      <div style={{ marginTop: 18 }}>
        {classes.length === 0 ? (
          <div
            style={{
              padding: 18,
              border: "1px dashed #bbb",
              borderRadius: 10,
              background: "#fafafa",
            }}
          >
            Chưa có lớp nào. Bấm <b>“+ Tạo class”</b> để tạo lớp đầu tiên.
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: 18,
              border: "1px dashed #bbb",
              borderRadius: 10,
              background: "#fafafa",
            }}
          >
            Không tìm thấy môn phù hợp.
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              style={{
                padding: 14,
                marginBottom: 12,
                border: "1px solid #ddd",
                borderRadius: 10,
                background: "#fff",
              }}
            >
              {/* ✅ Môn - Mã môn */}
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                {c.subjectName} - {c.subjectCode}
              </div>

              {/* ✅ Ngày - Ca */}
              <div style={{ marginTop: 4 }}>
                {dayLabel(c.dayOfWeek)} - Ca {c.period}
              </div>

              {/* ✅ GV dưới 2 dòng kia */}
              <div style={{ marginTop: 4, color: "#555" }}>GV: {c.teacherName}</div>

              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #111",
                    background: "#111",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Quản lý buổi điểm danh
                </button>
                <button
                  type="button"
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Duyệt xin vắng
                </button>
                <button
                  type="button"
                  onClick={() => setClasses((prev) => prev.filter((x) => x.id !== c.id))}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #f3c2c2",
                    background: "#fff5f5",
                    color: "#b00020",
                    cursor: "pointer",
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ====== MODAL CREATE ====== */}
      {open ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 999,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #eee",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Tạo class mới</div>
              <div style={{ color: "#666", marginTop: 4 }}>
                Nhập: Tên môn, Mã môn, Tên giảng viên, Ngày học (T2–CN), Ca (1–4).
              </div>
            </div>

            <form onSubmit={submit} style={{ padding: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field
                  label="Tên môn học"
                  value={form.subjectName}
                  onChange={(v) => setForm((p) => ({ ...p, subjectName: v }))}
                  error={errors.subjectName}
                  placeholder="VD: Công nghệ phần mềm"
                />
                <Field
                  label="Mã môn"
                  value={form.subjectCode}
                  onChange={(v) => setForm((p) => ({ ...p, subjectCode: v }))}
                  error={errors.subjectCode}
                  placeholder="VD: SE001"
                />
                <Field
                  label="Tên giảng viên"
                  value={form.teacherName}
                  onChange={(v) => setForm((p) => ({ ...p, teacherName: v }))}
                  error={errors.teacherName}
                  placeholder="VD: ThS. Nguyễn Văn A"
                />

                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Ngày học</div>
                  <select
                    value={form.dayOfWeek}
                    onChange={(e) => setForm((p) => ({ ...p, dayOfWeek: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                    }}
                  >
                    {DAYS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Ca học</div>
                  <select
                    value={form.period}
                    onChange={(e) => setForm((p) => ({ ...p, period: Number(e.target.value) }))}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                    }}
                  >
                    {PERIODS.map((p) => (
                      <option key={p} value={p}>
                        Ca {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #111",
                    background: "#111",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Tạo class
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ====== SMALL COMPONENTS ====== */
function Stat({ label, value }) {
  return (
    <div
      style={{
        minWidth: 160,
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 10,
        background: "#fff",
      }}
    >
      <div style={{ color: "#666", fontSize: 13 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 22, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, error }) {
  return (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: error ? "1px solid #ff8a8a" : "1px solid #ccc",
          background: error ? "#fff2f2" : "#fff",
        }}
      />
      {error ? <div style={{ color: "#b00020", marginTop: 4, fontSize: 12 }}>{error}</div> : null}
    </div>
  );
}
