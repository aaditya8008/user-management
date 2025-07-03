import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = () => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => toast.error("Failed to load users"));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    const res = await fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("User deleted");
      fetchUsers();
    } else {
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {users.map((u) => (
          <div key={u.id} className="border p-4 shadow rounded bg-white">
            <p><b>Name:</b> {u.first_name} {u.last_name}</p>
            <p><b>Email:</b> {u.email}</p>
            <p><b>Phone:</b> {u.phone}</p>
            <p><b>PAN:</b> {u.pan}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => navigate(`/edit/${u.id}`)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(u.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
