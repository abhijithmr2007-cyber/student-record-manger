# Student Record Manager

A simple MERN Stack application for managing student records. The React frontend uses an Express API to store records in MongoDB Atlas.

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
│   │   │   └── studentService.js
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

The frontend environment variable is:

```text
VITE_API_URL=http://localhost:5000
```

The backend environment variables are:

```text
PORT=5000
MONGODB_URI=
CLIENT_ORIGIN=http://localhost:5173
```

Add your MongoDB Atlas connection string to `MONGODB_URI` in your local `server/.env` file. Do not put credentials in this README or in either `.env.example` file. The `.env` files are excluded by `.gitignore`.

## Run locally

Start the backend in one terminal:

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

1. Start the backend and frontend using the commands above.
2. Check API availability at `http://localhost:5000/api/health`.
3. In the app, add a record, then verify it appears in the list.
4. Try editing and deleting the record, and try search, department filtering, and both CGPA sort directions.
5. Build the frontend from the client folder:

   ```powershell
   Set-Location .\client
   npm run build
   ```

## Hosted project

Hosted project URL: _Add the project URL here after deployment._
