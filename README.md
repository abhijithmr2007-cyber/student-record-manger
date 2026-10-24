# Student Record Manager

A simple MERN Stack application for managing student records. The frontend supports two modes:

- The GitHub Pages demo uses browser `localStorage` and does not need a hosted backend.
- The full local MERN application uses the Express API and MongoDB Atlas.

Records created in the GitHub Pages demo are saved only in the current browser. They are not synchronized with MongoDB or other browsers.

## Features

- Add student records
- View student records
- Edit student records
- Delete student records
- Search by student name or roll number
- Filter by department
- Sort by CGPA in ascending or descending order

## Technologies

- React and Vite
- Node.js and Express
- MongoDB Atlas and Mongoose
- JavaScript

## Project structure

```text
student-record-manager/
├── client/
│   ├── src/
│   │   ├── services/
│   │   │   ├── studentService.js
│   │   │   ├── localStudentService.js
│   │   │   └── studentDataService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── server/
│   ├── controllers/
│   │   └── studentController.js
│   ├── models/
│   │   └── Student.js
│   ├── routes/
│   │   └── studentRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── .gitignore
```

## Installation

Install the frontend and backend dependencies in separate PowerShell terminals, or run these commands from the project root:

```powershell
Set-Location .\client
npm install
Set-Location ..\server
npm install
Set-Location ..
```

## Environment configuration

Create local environment files from the examples:

```powershell
Copy-Item .\client\.env.example .\client\.env
Copy-Item .\server\.env.example .\server\.env
```

For local API development, the frontend environment variables are:

```text
VITE_STORAGE_MODE=api
VITE_API_URL=http://localhost:5000
```

To run the frontend locally using browser storage instead, set:

```text
VITE_STORAGE_MODE=local
```

The backend environment variables are:

```text
PORT=5000
MONGODB_URI=
CLIENT_ORIGIN=http://localhost:5173
```

Add your MongoDB Atlas connection string to `MONGODB_URI` in your local `server/.env` file. Do not put credentials in this README or in either `.env.example` file. The `.env` files are excluded by `.gitignore`.

## Run locally

### Full MERN mode

The local `client/.env` uses API mode. Start the backend in one terminal:

```powershell
Set-Location .\server
npm run dev
```

Start the frontend in a second terminal:

```powershell
Set-Location .\client
npm run dev
```

Open the Vite URL shown in the frontend terminal (normally `http://localhost:5173/`). The backend runs on port `5000`.

### Local browser-storage mode

Set `VITE_STORAGE_MODE=local` in `client/.env`, then start only the frontend:

```powershell
Set-Location .\client
npm run dev
```

This mode does not make API requests. Student records persist in the current browser's local storage and do not sync with MongoDB.

### GitHub Pages

The GitHub Actions Pages workflow builds the frontend with `VITE_STORAGE_MODE=local`. The hosted demo therefore works without a backend, with records saved only in each visitor's browser. It does not read or write MongoDB.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check API status |
| GET | `/api/students` | List students |
| GET | `/api/students?search=Rahul` | Search names and roll numbers |
| GET | `/api/students?dept=CSE` | Filter by department |
| GET | `/api/students?sort=asc` | Sort by CGPA ascending |
| GET | `/api/students?sort=desc` | Sort by CGPA descending |
| POST | `/api/students` | Add a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

Search, department, and sort query parameters can be combined. Student records use the fields `name`, `rollNo`, `department`, `semester`, `cgpa`, and `contact`.

## Testing

1. Start the frontend in API mode and backend for the full MERN app, or start the frontend alone in local storage mode.
2. For API mode, check availability at `http://localhost:5000/api/health`.
3. In either mode, add a record, then verify it appears in the list and remains after a page refresh.
4. Try editing and deleting the record, and try search, department filtering, and both CGPA sort directions.
5. Build the frontend from the client folder:

   ```powershell
   Set-Location .\client
   npm run build
   ```

## Hosted project

Hosted project URL: _Add the project URL here after deployment._
