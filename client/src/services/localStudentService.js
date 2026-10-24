const STORAGE_KEY = "student-record-manager.students.v1";

function readStudents() {
  let savedStudents;

  try {
    savedStudents = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    throw new Error("Browser storage is unavailable. Check your browser settings.");
  }

  if (savedStudents === null) {
    return [];
  }

  let students;
  try {
    students = JSON.parse(savedStudents);
  } catch (error) {
    throw new Error("Saved student data is invalid and could not be read.");
  }

  if (
    !Array.isArray(students) ||
    students.some(
      (student) =>
        !student ||
        typeof student._id !== "string" ||
        !student._id ||
        typeof student.name !== "string" ||
        typeof student.rollNo !== "string" ||
        typeof student.department !== "string" ||
        !Number.isInteger(student.semester) ||
        student.semester < 1 ||
        student.semester > 8 ||
        typeof student.cgpa !== "number" ||
        !Number.isFinite(student.cgpa) ||
        student.cgpa < 0 ||
        student.cgpa > 10 ||
        typeof student.contact !== "string",
    )
  ) {
    throw new Error("Saved student data has an invalid format.");
  }

  return students;
}

function writeStudents(students) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    throw new Error("Could not save student data in browser storage.");
  }
}

function createStudentId(students) {
  let id;
  do {
    id =
      typeof globalThis.crypto?.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  } while (students.some((student) => student._id === id));

  return id;
}

function validateStudent(student, students, editingId = null) {
  if (
    !student ||
    typeof student.name !== "string" ||
    !student.name.trim() ||
    typeof student.rollNo !== "string" ||
    !student.rollNo.trim() ||
    typeof student.department !== "string" ||
    !student.department.trim() ||
    typeof student.contact !== "string" ||
    !student.contact.trim()
  ) {
    throw new Error("Please complete all fields.");
  }

  if (
    !Number.isInteger(student.semester) ||
    student.semester < 1 ||
    student.semester > 8
  ) {
    throw new Error("Semester must be a whole number from 1 to 8.");
  }

  if (!Number.isFinite(student.cgpa) || student.cgpa < 0 || student.cgpa > 10) {
    throw new Error("CGPA must be a number from 0 to 10.");
  }

  const duplicateRollNumber = students.some(
    (savedStudent) =>
      savedStudent._id !== editingId &&
      savedStudent.rollNo.toLowerCase() === student.rollNo.trim().toLowerCase(),
  );

  if (duplicateRollNumber) {
    throw new Error("That roll number already exists.");
  }
}

export async function getLocalStudents({ search = "", department = "", sort = "" }) {
  let students = readStudents();
  const query = search.trim().toLowerCase();

  students = students.filter((student) => {
    const matchesSearch =
      !query ||
      student.name.toLowerCase().includes(query) ||
      student.rollNo.toLowerCase().includes(query);
    const matchesDepartment = !department || student.department === department;

    return matchesSearch && matchesDepartment;
  });

  if (sort === "asc") {
    students.sort((first, second) => first.cgpa - second.cgpa);
  } else if (sort === "desc") {
    students.sort((first, second) => second.cgpa - first.cgpa);
  }

  return students;
}

export async function addLocalStudent(student) {
  const students = readStudents();
  validateStudent(student, students);

  const newStudent = {
    ...student,
    name: student.name.trim(),
    rollNo: student.rollNo.trim(),
    department: student.department.trim(),
    contact: student.contact.trim(),
    _id: createStudentId(students),
  };

  writeStudents([...students, newStudent]);
  return newStudent;
}

export async function updateLocalStudent(id, student) {
  const students = readStudents();
  const studentIndex = students.findIndex(
    (savedStudent) => savedStudent._id === id,
  );

  if (studentIndex === -1) {
    throw new Error("Student record not found in this browser.");
  }

  validateStudent(student, students, id);
  const updatedStudent = {
    ...student,
    name: student.name.trim(),
    rollNo: student.rollNo.trim(),
    department: student.department.trim(),
    contact: student.contact.trim(),
    _id: id,
  };

  students[studentIndex] = updatedStudent;
  writeStudents(students);
  return updatedStudent;
}

export async function deleteLocalStudent(id) {
  const students = readStudents();
  const remainingStudents = students.filter((student) => student._id !== id);

  if (remainingStudents.length === students.length) {
    throw new Error("Student record not found in this browser.");
  }

  writeStudents(remainingStudents);
}
