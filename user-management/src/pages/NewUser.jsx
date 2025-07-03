import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateUser } from "../utils/validation";
import toast from "react-hot-toast";

export default function NewUser() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    pan: "",
  });

  const [excelFile, setExcelFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPan, setShowPan] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateUser(user);
    if (Object.keys(errs).length) return setErrors(errs);

    const res = await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (res.ok) {
      toast.success("User added");
      navigate("/users");
    } else {
      toast.error("Failed to add user");
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile) return toast.error("Please select a file");
    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const res = await fetch("http://localhost:8000/upload-excel", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Excel uploaded successfully");
        navigate("/users");
      } else {
        toast.error("Excel upload failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Add New User</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["first_name", "last_name", "email", "phone"].map((field) => (
          <div key={field}>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={user[field]}
              onChange={handleChange}
              placeholder={field.replace("_", " ").toUpperCase()}
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
              placeholder="PAN"
              className="border w-full p-2 rounded"
            />
            <button
              type="button"
              className="text-sm underline"
              onClick={() => setShowPan(!showPan)}
            >
              {showPan ? "Hide" : "Show"}
            </button>
          </div>
          {errors.pan && <p className="text-red-600 text-sm">{errors.pan}</p>}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {/* Excel Upload Section */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">📥 Upload Excel File</h3>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setExcelFile(e.target.files[0])}
          className="border p-2 rounded w-full mb-3"
        />
        <button
          onClick={handleExcelUpload}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Upload Excel
        </button>
      </div>
    </div>
  );
}
