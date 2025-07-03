import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateUser } from "../utils/validation";
import toast from "react-hot-toast";

export default function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPan, setShowPan] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/users/${id}`)
      .then((res) => res.json())
      .then(setUser)
      .catch(() => toast.error("Failed to fetch user"));
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateUser(user);
    if (Object.keys(errs).length) return setErrors(errs);

    const res = await fetch(`http://localhost:8000/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (res.ok) {
      toast.success("User updated");
      navigate("/users");
    } else {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["first_name", "last_name", "email", "phone"].map((field) => (
          <div key={field}>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={user[field]}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
            {errors[field] && (
              <p className="text-red-600 text-sm">{errors[field]}</p>
            )}
          </div>
        ))}

        <div>
          <div className="flex items-center gap-2">
            <input
              type={showPan ? "text" : "password"}
              name="pan"
              value={user.pan}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
            <button
              type="button"
              onClick={() => setShowPan(!showPan)}
              className="text-sm underline"
            >
              {showPan ? "Hide" : "Show"}
            </button>
          </div>
          {errors.pan && <p className="text-red-600 text-sm">{errors.pan}</p>}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
