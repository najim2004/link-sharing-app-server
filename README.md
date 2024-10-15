# DevLinks24 Backend

This repository contains the backend code for **DevLinks24**, a link-sharing platform that allows users to manage and share their links efficiently. Built using Node.js, Express.js, and MongoDB, the backend provides a secure and maintainable API for user authentication, link management, and profile updates.

## 🛠️ Technologies Used

- **Node.js**: JavaScript runtime for the server
- **Express.js**: Web framework for Node.js
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: Secure authentication
- **MVC Architecture**: Clean and maintainable code structure

## 📋 Features

1. **User Authentication**: Secure JWT-based authentication for login and registration.
2. **Link Management**: Create, update, delete, and fetch links for authenticated users.
3. **Profile Management**: Update user profile details.
4. **RESTful API**: Provides a well-structured API for frontend communication.
5. **MVC Architecture**: Separation of concerns for easier maintenance.

## 📝 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js and npm should be installed.
- MongoDB should be running locally or a cloud instance should be available.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/najim2004/link-sharing-app-server
   cd link-sharing-app-server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```plaintext
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the server:**

   ```bash
   npm start
   ```

5. **API will be running at:**
   ```
   http://localhost:5000
   ```

## 📚 API Endpoints

- `POST /api/users/register`: Register a new user.
- `POST /api/users/login`: User login.
- `GET /api/users/login`: Fetch user details.
- `PATCH /api/users`: Update user profile.
- `GET /api/links`: Fetch all links for the authenticated user.
- `POST /api/links`: Add a new link.
- `PATCH /api/links/:id`: Update an existing link.
- `DELETE /api/links/:id`: Delete a link.

## 🤝 Contributing

Contributions are welcome! Please submit issues or pull requests.
