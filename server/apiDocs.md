## Authentication & Authorization

### 1. **POST /register**

- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "User created successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Email is required"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Password is required"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "email is already registered"
    }
    ```

### 2. **POST /login**

- **Description**: Log in to the system and receive an access token.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "access_token": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Email is required"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "Password is required"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "email must be of format email"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "email is already registered""
    }
    ```

### 3. **POST /auth/google**

- **Description**: Google OAuth login.
- **Request Body**:
  ```json
  {
    "googleToken": "string"
  }
  ```
- **Response**:
  - **200 OK** or **201 Created**:
    ```json
    {
      "access_token": "string"
    }
    ```

---

## User Management (Protected Routes)

These routes require authentication.

### 4. **GET /users/**

- **Description**: Retrieve the current logged-in user's information.
- **Response**:
  - **200 OK**:
    ```json
    {
      "name": "string",
      "email": "string"
    }
    ```
  - **401 Bad Request**:
    ```json
    {
      "message": "Invalid token"
    }
    ```

### 5. **PATCH /users/edit**

- **Description**: Edit the current logged-in user's information.
- **Request Body**:
  ```json
  {
    "name": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "User updated successfully"
    }
    ```
  - **401 Bad Request**:
    ```json
    {
      "message": "Invalid token"
    }
    ```

### 6. **DELETE /users/delete**

- **Description**: Delete the current logged-in user.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "User deleted successfully"
    }
    ```
  - **401 Bad Request**:
    ```json
    {
      "message": "Invalid token"
    }
    ```

---

## News Management (Protected Routes)

These routes require authentication.

### 7. **GET /news**

- **Description**: Retrieve all news. You can optionally filter news by query.
- **Query Parameters**:
  - `q`: Filter news by title.
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "title": "string",
          "body": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
    ```
  - **401 Bad Request**:
    ```json
    {
      "message": "Invalid token"
    }
    ```

### 8. **POST /news/summarize**

- **Description**: Summarize the provided text (e.g., news article).
- **Request Body**:
  ```json
  {
    "text": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "text": "summarized text"
    }
    ```
  - **401 Bad Request**:
    ```json
    {
      "message": "Invalid token"
    }
    ```

### 9. **GET /news/:id**

- **Description**: Retrieve a single news item by its ID.
- **Path Parameter**:
  - `id`: The ID of the news item.
- **Response**:
  - **200 OK**:
    ```json
    {
      "id": 1,
      "title": "string",
      "body": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
    ```
  - **401 Bad Request**:
    ```json
    {
      "message": "Invalid token"
    }
    ```
  - **404 NOT FOUND**:
    ```json
    {
      "text": "Data not found""
    }
    ```

### 10. **POST /news/synthesize**

- **Description**: Synthesize the provided text into speech (MP3 format).
- **Request Body**:
  ```json
  {
    "text": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "audioContent": "string"
    }
    ```
  - **401 Bad Request**:
    ```json
    {
      "message": "Invalid token"
    }
    ```

---

## Global Error

### 1. **Internal Server Error**

- **Status**: 500
- **Response**:
  ```json
  {
    "message": "Internal Server Error"
  }
  ```

---
