import React, { useEffect, useState } from "react";
import {
  addStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "./services/studentService.js";

const departments = [
  { value: "CSE", label: "Computer Science" },
  { value: "IT", label: "Information Technology" },
  { value: "ME", label: "Mechanical Engineering" },
];

const emptyForm = {
  name: "",
  rollNumber: "",
  department: "",
  semester: "",
  cgpa: "",
  contactNumber: "",
};

function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [cgpaSort, setCgpaSort] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setLoadError("");

    getStudents({
      search,
      department: departmentFilter,
      sort: cgpaSort === "ascending" ? "asc" : cgpaSort === "descending" ? "desc" : "",
      signal: controller.signal,
    })
      .then((data) => setStudents(data))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setLoadError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [search, departmentFilter, cgpaSort, refreshVersion]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setFormError("");
    setSuccessMessage("");
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedForm = {
      name: form.name.trim(),
      rollNo: form.rollNumber.trim(),
      department: form.department,
      semester: Number(form.semester),
      cgpa: Number(form.cgpa),
      contact: form.contactNumber.trim(),
    };

    if (
      !cleanedForm.name ||
      !cleanedForm.rollNo ||
      !cleanedForm.department ||
      !form.semester ||
      !form.cgpa ||
      !cleanedForm.contact
    ) {
      setFormError("Please complete all fields.");
      return;
    }

    if (
      !Number.isInteger(cleanedForm.semester) ||
      cleanedForm.semester < 1 ||
      cleanedForm.semester > 8
    ) {
      setFormError("Semester must be a whole number from 1 to 8.");
      return;
    }

    if (
      !Number.isFinite(cleanedForm.cgpa) ||
      cleanedForm.cgpa < 0 ||
      cleanedForm.cgpa > 10
    ) {
      setFormError("CGPA must be a number from 0 to 10.");
      return;
    }

    setIsMutating(true);
    setFormError("");
    setLoadError("");
    setSuccessMessage("");

    try {
      if (editingId !== null) {
        await updateStudent(editingId, cleanedForm);
      } else {
        await addStudent(cleanedForm);
      }

      setSuccessMessage(
        editingId !== null
          ? "Student record updated successfully."
          : "Student added successfully.",
      );
      resetForm();
      setRefreshVersion((version) => version + 1);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsMutating(false);
    }
  }

  function handleEdit(student) {
    setForm({
      name: student.name,
      rollNumber: student.rollNo,
      department: student.department,
      semester: String(student.semester),
      cgpa: String(student.cgpa),
      contactNumber: student.contact,
    });
    setEditingId(student._id);
    setFormError("");
    setSuccessMessage("");
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete the record for ${student.name}?`)) {
      return;
    }

    setIsMutating(true);
    setLoadError("");
    setSuccessMessage("");

    try {
      await deleteStudent(student._id);
      if (editingId === student._id) {
        resetForm();
        setFormError("");
      }
      setSuccessMessage("Student deleted successfully.");
      setRefreshVersion((version) => version + 1);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setIsMutating(false);
    }
  }

  function handleCancelEdit() {
    resetForm();
    setFormError("");
    setSuccessMessage("");
  }

  function handleDepartmentChange(event) {
    setDepartmentFilter(event.target.value);
    setSuccessMessage("");
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setSuccessMessage("");
  }

  function handleSortChange(event) {
    setCgpaSort(event.target.value);
    setSuccessMessage("");
  }

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Student records</p>
        <h1>Student Record Manager</h1>
        <p className="subtitle">
          Add, update, and find student information in one place.
        </p>
      </header>

      <section className="panel form-panel" aria-labelledby="form-heading">
        <div className="section-heading">
          <div>
            <h2 id="form-heading">
              {editingId === null ? "Add a student" : "Edit student"}
            </h2>
            <p>Enter the student details below.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="e.g. Alex Johnson"
                autoComplete="name"
              />
            </label>
            <label>
              Roll Number
              <input
                name="rollNumber"
                value={form.rollNumber}
                onChange={handleInputChange}
                placeholder="e.g. CS2024004"
              />
            </label>
            <label>
              Department
              <select
                name="department"
                value={form.department}
                onChange={handleInputChange}
              >
                <option value="">Select a department</option>
                {departments.map((department) => (
                  <option key={department.value} value={department.value}>
                    {department.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Semester
              <input
                name="semester"
                type="number"
                min="1"
                max="8"
                step="1"
                value={form.semester}
                onChange={handleInputChange}
                placeholder="1–8"
              />
            </label>
            <label>
              CGPA
              <input
                name="cgpa"
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={form.cgpa}
                onChange={handleInputChange}
                placeholder="0.00–10.00"
              />
            </label>
            <label>
              Contact Number
              <input
                name="contactNumber"
                type="tel"
                value={form.contactNumber}
                onChange={handleInputChange}
                placeholder="e.g. 9876543210"
                autoComplete="tel"
              />
            </label>
          </div>

          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}

          <div className="form-actions">
            <button
              className="button button-primary"
              type="submit"
              disabled={isMutating}
            >
              {isMutating
                ? "Saving…"
                : editingId === null
                  ? "Add student"
                  : "Save changes"}
            </button>
            {editingId !== null && (
              <button
                className="button button-secondary"
                type="button"
                onClick={handleCancelEdit}
                disabled={isMutating}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel records-panel" aria-labelledby="records-heading">
        <div className="section-heading records-heading">
          <div>
            <h2 id="records-heading">Student records</h2>
            <p>
              {students.length} {students.length === 1 ? "student" : "students"}
            </p>
          </div>
        </div>

        {successMessage && (
          <p className="success-message" role="status">
            {successMessage}
          </p>
        )}

        <div className="toolbar">
          <label className="search-field">
            <span>Search</span>
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Name or roll number"
            />
          </label>
          <label>
            <span>Department</span>
            <select
              value={departmentFilter}
              onChange={handleDepartmentChange}
            >
              <option value="">All departments</option>
              {departments.map((department) => (
                <option key={department.value} value={department.value}>
                  {department.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Sort by CGPA</span>
            <select
              value={cgpaSort}
              onChange={handleSortChange}
            >
              <option value="">Default order</option>
              <option value="ascending">Lowest first</option>
              <option value="descending">Highest first</option>
            </select>
          </label>
        </div>

        {isLoading ? (
          <p className="status-message" role="status">
            Loading student records…
          </p>
        ) : loadError ? (
          <p className="form-error" role="alert">
            {loadError}
          </p>
        ) : students.length === 0 ? (
          <p className="status-message">
            {search || departmentFilter
              ? "No students match your search or filters."
              : "No student records yet. Add a student using the form above."}
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>CGPA</th>
                  <th>Contact Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td data-label="Name">{student.name}</td>
                    <td data-label="Roll Number">{student.rollNo}</td>
                    <td data-label="Department">{student.department}</td>
                    <td data-label="Semester">{student.semester}</td>
                    <td data-label="CGPA">{student.cgpa.toFixed(2)}</td>
                    <td data-label="Contact Number">{student.contact}</td>
                    <td className="row-actions" data-label="Actions">
                      <button
                        className="button button-small button-secondary"
                        type="button"
                        onClick={() => handleEdit(student)}
                        disabled={isMutating}
                        aria-label={`Edit ${student.name}`}
                      >
                        Edit
                      </button>
                      <button
                        className="button button-small button-danger"
                        type="button"
                        onClick={() => handleDelete(student)}
                        disabled={isMutating}
                        aria-label={`Delete ${student.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="page-footer">
        Student records are saved to the database.
      </footer>
    </main>
  );
}

export default App;
