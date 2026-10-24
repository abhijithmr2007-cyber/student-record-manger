import {
  addStudent as addApiStudent,
  deleteStudent as deleteApiStudent,
  getStudents as getApiStudents,
  updateStudent as updateApiStudent,
} from "./studentService.js";
import {
  addLocalStudent,
  deleteLocalStudent,
  getLocalStudents,
  updateLocalStudent,
} from "./localStudentService.js";

export const isLocalStorageMode = import.meta.env.VITE_STORAGE_MODE === "local";

export function getStudents(options) {
  return isLocalStorageMode ? getLocalStudents(options) : getApiStudents(options);
}

export function addStudent(student) {
  return isLocalStorageMode ? addLocalStudent(student) : addApiStudent(student);
}

export function updateStudent(id, student) {
  return isLocalStorageMode
    ? updateLocalStudent(id, student)
    : updateApiStudent(id, student);
}

export function deleteStudent(id) {
  return isLocalStorageMode ? deleteLocalStudent(id) : deleteApiStudent(id);
}
