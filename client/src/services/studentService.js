const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_URL is not configured. Add it to client/.env.");
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      `Unable to reach the API. Check that the backend is running at ${API_BASE_URL}.`,
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(`The API returned an invalid response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(data.message || `The request failed (HTTP ${response.status}).`);
  }

  return data;
}

function jsonOptions(method, student) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  };
}

export async function getStudents({ search, department, sort, signal }) {
  const query = new URLSearchParams();

  if (search.trim()) query.set("search", search.trim());
  if (department) query.set("dept", department);
  if (sort) query.set("sort", sort);

  const queryString = query.toString();
  const students = await request(
    `/api/students${queryString ? `?${queryString}` : ""}`,
    { signal },
  );

  if (!Array.isArray(students)) {
    throw new Error("The API returned an unexpected student list.");
  }

  return students;
}

export function addStudent(student) {
  return request("/api/students", jsonOptions("POST", student));
}

export function updateStudent(id, student) {
  return request(
    `/api/students/${encodeURIComponent(id)}`,
    jsonOptions("PUT", student),
  );
}

export function deleteStudent(id) {
  return request(`/api/students/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
