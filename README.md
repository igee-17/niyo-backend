**Running the Task Management Application**

**Prerequisites:**

- **Node.js and npm (or yarn):** Make sure you have Node.js installed on your system. You can check by running `node -v` and `npm -v` (or `yarn -v`) in your terminal. If you don't have it, download and install it from the official Node.js website.
- **MySQL Server:** Ensure you have a MySQL server running and accessible. You should have created a database named `task_db` (or adjusted the configuration to match your database name).
- **Environment Variables:** Create a `.env` file in the root directory of your project to store sensitive information like database credentials. This file should contain the following:

```
PORT=8000
DB_HOST=host
DB_USER=user
DB_PASSWORD=YOURPASSWORD
DB_NAME=task_db
```

**Steps:**

1. **Clone or download the project:**

   ```bash
   git clone <your_repository_url>
   cd task-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the server:**

   ```bash
   npm start
   ```

   The server should start running on the port specified in your `.env` file (default is 8000).

**Endpoints:**

You can now interact with the API using tools like Postman, curl, or your frontend application. Refer to the API documentation for details on each endpoint.

**Additional Notes:**

- **Running with Nodemon (for development):** If you'd like the server to restart automatically when you make changes to your code, you can use Nodemon:
  ```bash
  npm install -g nodemon
  nodemon server.js
  ```

**Task Management API Documentation**

**Base URL:** `/user/tasks`

**Authentication:**

- Assumes a middleware is in place to authenticate users and add their `userId` to the request object (`req.userId`).
- Assumes a `getUserEmail` function exists to fetch the user's email based on their ID.

**Error Handling:**

- All routes include `try...catch` blocks to handle errors gracefully.
- Error responses will have a `500` status code and a JSON payload with a `message` field containing the error details.
- Specific error codes (e.g., `404` for not found) are used where appropriate.

**Routes**

---

**GET /tasks**

Retrieves all tasks for the authenticated user.

- **Request:**
  - Headers:
    - Authorization: (Bearer token or any other authentication method you are using)
- **Response:**
  - **Success (200 OK):**
    ```json
    {
      "tasks": [
        {
          "id": 1,
          "title": "Task 1",
          "description": "Description 1",
          "completed": false,
          "userEmail": "user@example.com",
          "status": "in-progress",
          "createdAt": "2024-05-19T22:28:00.000Z"
        }
        // ... more tasks
      ]
    }
    ```
  - **Success (200 OK) - No tasks:**
    ```json
    {
      "message": "No tasks found",
      "tasks": []
    }
    ```

---

**GET /tasks/get-task/:id'**

Retrieves a specific task by ID, if it belongs to the authenticated user.

- **Request:**
  - Path Parameters:
    - `id` (integer): The ID of the task to retrieve.
  - Headers:
    - Authorization: (Bearer token or any other authentication method you are using)
- **Response:**
  - **Success (200 OK):**
    ```json
    {
      "id": 1,
      "title": "Task 1",
      "description": "Description 1",
      "completed": false,
      "userEmail": "user@example.com",
      "status": "in-progress",
      "createdAt": "2024-05-19T22:28:00.000Z"
    }
    ```
  - **Error (404 Not Found):**
    - Task not found or does not belong to the authenticated user.
    ```json
    { "message": "Task not found or you do not have permission to update it" }
    ```

---

**POST /tasks/create-task**

Creates a new task for the authenticated user.

- **Request:**
  - Headers:
    - Authorization: (Bearer token or any other authentication method you are using)
  - Body:
    ```json
    {
      "title": "New Task",
      "description": "Optional description",
      "completed": false
    }
    ```
    - `title` (string, required): The title of the task.
    - `description` (string, optional): A description of the task.
    - `completed` (boolean, optional, defaults to `false`): Whether the task is completed.
- **Response:**
  - **Success (201 Created):**
    ```json
    {
      "id": 2,
      "title": "New Task",
      "description": "Optional description",
      "completed": false,
      "userEmail": "user@example.com",
      "status": "in-progress",
      "createdAt": "2024-05-19T22:28:00.000Z"
    }
    ```

---

**PUT /tasks/modify-task/:id**

Updates a task's title, description, or status if it belongs to the authenticated user.

- **Request:**
  - Path Parameters:
    - `id` (integer): The ID of the task to update.
  - Headers:
    - Authorization: (Bearer token or any other authentication method you are using)
  - Body:
    ```json
    {
      "title": "Updated Task Title",
      "description": "Updated description",
      "status": "in-review"
    }
    ```
    - `title` (string, optional): The new title of the task.
    - `description` (string, optional): The new description of the task.
    - `status` (string, optional, one of: "in-progress", "in-review", "completed"): The new status of the task.
- **Response:**
  - **Success (200 OK):**
    - Returns the updated task data.
  - **Error (404 Not Found):**
    - Task not found or does not belong to the authenticated user.
    ```json
    { "message": "Task not found or you do not have permission to update it" }
    ```

---

**DELETE /tasks/delete-task/:id**

Deletes a task by ID if it belongs to the authenticated user.

- **Request:**
  - Path Parameters:
    - `id` (integer): The ID of the task to delete.
  - Headers:
    - Authorization: (Bearer token or any other authentication method you are using)
- **Response:**
  - **Success (200 OK):**
    ```json
    { "message": "Task deleted successfully" }
    ```
  - **Error (404 Not Found):**
    - Task not found or does not belong to the authenticated user.
    ```json
    { "message": "Task not found or you do not have permission to delete it" }
    ```

**Real-time Updates (Socket.IO):**

- **newTask:** Emitted when a new task is created.
- **updateTask:** Emitted when a task is updated.
- **deleteTask:** Emitted when a task is deleted.

**Authentication API Documentation**

**Base URL:** (`/auth`)

**Error Handling:**

- Standard error responses will be in JSON format with a `message` field containing the error description.
- Status codes:
  - `400 Bad Request`: For missing or invalid input data.
  - `401 Unauthorized`: For incorrect login credentials or missing authentication.
  - `409 Conflict`: For duplicate email during signup.

---

**POST /auth/signup**

Creates a new user account.

- **Request:**
  - Body (JSON):
    ```json
    {
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@example.com",
      "phone": "1234567890",
      "password": "securepassword"
    }
    ```
    - `firstname` (string, required): User's first name.
    - `lastname` (string, required): User's last name.
    - `email` (string, required): User's email address (must be valid).
    - `phone` (string, required): User's phone number.
    - `password` (string, required): User's password.
- **Response:**
  - **Success (201 Created):**
    ```json
    {
      "message": "User created successfully",
      "user": {
        "firstname": "John",
        "lastname": "Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890",
        "id": 123,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJpYXQiOjE2ODQ2NDI1NzV9.fN7y_..."
      }
    }
    ```
    - Includes the newly created user's information and an authentication token (JWT).
  - **Error (400 Bad Request):**
    ```json
    { "message": "Missing required fields" }
    ```
    or
    ```json
    { "message": "Invalid email format" }
    ```
  - **Error (409 Conflict):**
    ```json
    { "message": "Email already exists" }
    ```

---

**POST /auth/signin**

Authenticates a user and provides an access token.

- **Request:**
  - Body (JSON):
    ```json
    {
      "email": "john.doe@example.com",
      "password": "securepassword"
    }
    ```
    - `email` (string, required): User's email address.
    - `password` (string, required): User's password.
- **Response:**
  - **Success (200 OK):**
    ```json
    {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJpYXQiOjE2ODQ2NDI1NzV9.fN7y_...",
      "user": {
        // ... user details (including the 'token' field)
      }
    }
    ```
    - Includes an authentication token (JWT) and user details.
  - **Error (400 Bad Request):**
    ```json
    { "message": "Missing email or password" }
    ```
  - **Error (401 Unauthorized):**
    ```json
    { "message": "Invalid email or password" }
    ```

---

**POST /auth/logout**

Logs the user out. (The provided code doesn't actually invalidate the token; you'll need to implement a token blacklist or similar mechanism for that.)

- **Request:**
  - Headers:
    - Authorization: (Bearer token or any other authentication method you are using)
- **Response:**
  - **Success (200 OK):**
    ```json
    { "message": "Logged out successfully" }
    ```
