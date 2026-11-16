
import { useState } from "react";
import "./App.css";

const initialTodos = [
  {
    id: 1,
    title: "Mengerjakan Proyek Computer Vision",
    description:
      "Menyelesaikan proyek akhir computer vision tentang deteksi penggunaan helm",
    priority: "high",
    deadline: "2026-11-20",
    status: "in progress",
  },
  {
    id: 2,
    title: "Mempelajari Dasar Zustand",
    description:
      "Mempelajari dasar state management menggunakan Zustand",
    priority: "low",
    deadline: "2026-11-25",
    status: "in progress",
  },
  {
    id: 3,
    title: "Membuat Website Portfolio",
    description:
      "Membuat website portfolio pribadi",
    priority: "low",
    deadline: "2026-11-28",
    status: "in progress",
  },
  {
    id: 4,
    title: "Mempelajari React Hooks",
    description:
      "Memahami useState dan useEffect",
    priority: "low",
    deadline: "2026-12-01",
    status: "to-do",
  },
];

const emptyForm = {
  title: "",
  description: "",
  priority: "low",
  deadline: "",
  status: "to-do",
};

function TodoModal({
  form,
  setForm,
  editingId,
  onClose,
  onSubmit,
}) {
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          {editingId !== null ? "Update Todo" : "Tambah Todo"}
        </h2>

        <form onSubmit={onSubmit}>
          <label>Judul</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Masukkan judul tugas"
            required
          />

          <label>Deskripsi</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Masukkan deskripsi tugas"
          />

          <div className="form-row">
            <div>
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="to-do">to-do</option>
                <option value="in progress">in progress</option>
                <option value="done">done</option>
              </select>
            </div>

            <div>
              <label>Prioritas</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
          </div>

          <label>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            required
          />

          <div className="modal-actions">
            <button
              type="button"
              className="btn-delete"
              onClick={onClose}
            >
              Batal
            </button>

            <button
              type="submit"
              className="btn-primary"
            >
              {editingId !== null ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const selectedTodo = todos.find(
    (todo) => todo.id === selectedTodoId
  );

  function openAddModal() {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  }

  function openEditModal(todo) {
    setForm({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      deadline: todo.deadline,
      status: todo.status,
    });

    setEditingId(todo.id);
    setShowModal(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Judul tugas wajib diisi!");
      return;
    }

    if (!form.deadline) {
      alert("Deadline tugas wajib diisi!");
      return;
    }

    if (editingId !== null) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingId
            ? { ...todo, ...form }
            : todo
        )
      );

      setMessage("Tugas berhasil diperbarui!");
    } else {
      const newTodo = {
        id: Date.now(),
        ...form,
      };

      setTodos((prev) => [...prev, newTodo]);

      setMessage("Tugas berhasil ditambahkan!");
    }

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleDelete(id) {
    const confirmation = window.confirm(
      "Apakah kamu yakin ingin menghapus tugas ini?"
    );

    if (!confirmation) {
      return;
    }

    setTodos((prev) =>
      prev.filter((todo) => todo.id !== id)
    );

    setMessage("Tugas berhasil dihapus!");
  }

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(
      date + "T00:00:00"
    ).toLocaleDateString("id-ID");
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <div className="container">

      {message && (
        <div className="notification">
          <span>{message}</span>

          <button
            onClick={() => setMessage("")}
            type="button"
          >
            ×
          </button>
        </div>
      )}

      {selectedTodo ? (
        <div className="detail-card">
          <div>
            <h3>Judul</h3>
            <p>{selectedTodo.title}</p>

            <h3>Deskripsi</h3>
            <p>{selectedTodo.description || "-"}</p>
          </div>

          <div>
            <h3>Status</h3>
            <p>{selectedTodo.status}</p>

            <h3>Prioritas</h3>
            <p>{selectedTodo.priority}</p>

            <h3>Deadline</h3>
            <p>{formatDate(selectedTodo.deadline)}</p>

            <div className="actions">
              <button
                className="btn-delete"
                onClick={() => setSelectedTodoId(null)}
              >
                Kembali
              </button>

              <button
                className="btn-primary"
                onClick={() => openEditModal(selectedTodo)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <header>
            <h1>Todo List</h1>

            <button
              className="btn-primary"
              onClick={openAddModal}
            >
              Tambah Todo
            </button>
          </header>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Status</th>
                  <th>Prioritas</th>
                  <th>Deadline</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {todos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty">
                      Belum ada tugas.
                    </td>
                  </tr>
                ) : (
                  todos.map((todo) => (
                    <tr key={todo.id}>
                      <td>{todo.title}</td>
                      <td>{todo.status}</td>
                      <td>{todo.priority}</td>
                      <td>{formatDate(todo.deadline)}</td>

                      <td>
                        <div className="actions">
                          <button
                            className="btn-view"
                            title="Detail"
                            onClick={() =>
                              setSelectedTodoId(todo.id)
                            }
                          >
                            ◉
                          </button>

                          <button
                            className="btn-edit"
                            title="Update"
                            onClick={() => openEditModal(todo)}
                          >
                            ✎
                          </button>

                          <button
                            className="btn-delete"
                            title="Hapus"
                            onClick={() => handleDelete(todo.id)}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showModal && (
        <TodoModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

    </div>
  );
}

export default App;
