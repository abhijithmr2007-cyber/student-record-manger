const mongoose = require("mongoose");
const Student = require("../models/Student");

function isNumberInput(value) {
  return (
    (typeof value === "number" && Number.isFinite(value)) ||
    (typeof value === "string" &&
      value.trim() !== "" &&
      Number.isFinite(Number(value)))
  );
}

function validateStudentInput(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Request body must be a JSON object.";
  }

  const stringFields = ["name", "rollNo", "department", "contact"];
  for (const field of stringFields) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      return `${field} is required and must be a non-empty string.`;
    }
  }

  const semester = Number(body.semester);
  if (
    !isNumberInput(body.semester) ||
    !Number.isInteger(semester) ||
    semester < 1 ||
    semester > 8
  ) {
    return "Semester is required and must be a whole number from 1 to 8.";
  }

  const cgpa = Number(body.cgpa);
  if (
    !isNumberInput(body.cgpa) ||
    cgpa < 0 ||
    cgpa > 10
  ) {
    return "CGPA is required and must be a number from 0 to 10.";
  }

  return null;
}

function getStudentData(body) {
  return {
    name: body.name.trim(),
    rollNo: body.rollNo.trim(),
    department: body.department.trim(),
    semester: Number(body.semester),
    cgpa: Number(body.cgpa),
    contact: body.contact.trim(),
  };
}

function handleControllerError(error, res) {
  if (error.code === 11000) {
    return res.status(409).json({ message: "That roll number already exists." });
  }

  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({ message: error.message });
  }

  console.error("Student API error:", error);
  return res.status(500).json({ message: "An unexpected server error occurred." });
}

async function getStudents(req, res) {
  try {
    const { dept, search, sort } = req.query;

    if (
      (dept !== undefined && typeof dept !== "string") ||
      (search !== undefined && typeof search !== "string") ||
      (sort !== undefined && typeof sort !== "string")
    ) {
      return res
        .status(400)
        .json({ message: "Query parameters must be single values." });
    }

    if (sort && sort !== "asc" && sort !== "desc") {
      return res.status(400).json({ message: "Sort must be either 'asc' or 'desc'." });
    }

    const filter = {};
    if (dept && dept.trim()) {
      filter.department = dept.trim();
    }
    if (search && search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchPattern = new RegExp(escapedSearch, "i");
      filter.$or = [{ name: searchPattern }, { rollNo: searchPattern }];
    }

    const query = Student.find(filter);
    if (sort === "asc") {
      query.sort({ cgpa: 1 });
    } else if (sort === "desc") {
      query.sort({ cgpa: -1 });
    }

    const students = await query;
    return res.status(200).json(students);
  } catch (error) {
    return handleControllerError(error, res);
  }
}

async function createStudent(req, res) {
  const validationError = validateStudentInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const student = await Student.create(getStudentData(req.body));
    return res.status(201).json(student);
  } catch (error) {
    return handleControllerError(error, res);
  }
}

async function updateStudent(req, res) {
  const validationError = validateStudentInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid student ID." });
  }

  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      getStudentData(req.body),
      { new: true, runValidators: true },
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.status(200).json(student);
  } catch (error) {
    return handleControllerError(error, res);
  }
}

async function deleteStudent(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid student ID." });
  }

  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.status(200).json({ message: "Student deleted successfully." });
  } catch (error) {
    return handleControllerError(error, res);
  }
}

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};
