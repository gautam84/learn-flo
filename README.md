# Classroom Management System

This is a full-stack classroom management system that allows teachers to create and manage classrooms, give tests and assignments, and communicate with students. Students can join classrooms, take tests, and interact with their teachers and peers.

## Features

- **User Authentication:** Secure user registration and login for teachers and students.
- **Classroom Management:** Teachers can create, update, and delete their own classrooms.
- **Student Enrollment:** Students can enroll in classrooms.
- **Announcements:** Teachers can post announcements in their classrooms.
- **Test Creation:** Teachers can create multiple-choice or written tests with a specified duration.
- **Test Submission:** Students can take tests and submit their answers.
- **Real-time Chat:** A chat feature for communication within classrooms.

## Tech Stack

### Backend

- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Passport.js, JWT

### Frontend

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Lucide React

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v14 or later)
- pnpm
- NeonDb

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your_username/your_project.git](https://github.com/gautam84/learn-flo.git)
    ```
2.  **Set up the backend**
    - Navigate to the `backend` directory:
      ```sh
      cd backend
      ```
    - Install NPM packages:
      ```sh
      pnpm install
      ```
    - Set up your environment variables. Create a `.env` file in the `backend` directory and add your `DATABASE_URL`:
      ```
      DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
      ```
    - Apply database migrations:
      ```sh
      pnpm prisma migrate dev
      ```
    - Start the backend server:
      ```sh
      pnpm dev
      ```
      The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

3.  **Set up the frontend**
    - Navigate to the `frontend` directory:
      ```sh
      cd ../frontend
      ```
    - Install NPM packages:
      ```sh
      pnpm install
      ```
    - Start the frontend development server:
      ```sh
      pnpm dev
      ```
      The frontend will be available at `http://localhost:3000`.

## Project Structure

```
.
├── backend/        # Express.js backend
│   ├── prisma/     # Prisma schema and migrations
│   └── src/        # Source code
└── frontend/       # Next.js frontend
    └── src/        # Source code
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
