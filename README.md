# Book Review Application

Live Project: [Click Here](https://book-review6.onrender.com/)

## Project Description

This is a full-stack Book Review Application that allows users to discover books, read and write reviews, and see community ratings. The application features user authentication, book management, and a dynamic theme toggle for a personalized user experience.

## Features

*   **User Authentication:** Secure user registration and login.
*   **Book Management:** Add, view, and potentially edit book details.
*   **Review System:** Users can submit and view reviews for books.
*   **Community Ratings:** Aggregate ratings to provide an average score for each book.
*   **Responsive Design:** A user-friendly interface that adapts to various screen sizes.
*   **Theme Toggling:** Switch between light and dark modes for improved readability and user preference.

## Technologies Used

### Frontend

*   **React.js:** A JavaScript library for building user interfaces.
*   **React Router DOM:** For declarative routing in React applications.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **Vite:** A fast build tool for modern web projects.

### Backend

*   **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** A NoSQL document database for storing application data.
*   **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
*   **JWT (JSON Web Tokens):** For secure user authentication.

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Book_Review_App.git
cd Book_Review_App
```

### 2. Backend Setup

Navigate to the `backend` directory, install dependencies, and set up environment variables.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

*   Replace `your_mongodb_connection_string` with your MongoDB connection URI (e.g., from MongoDB Atlas or a local instance).
*   Replace `your_jwt_secret_key` with a strong, random string for JWT token signing.

To start the backend server:

```bash
node server.js
```

The backend server will run on `http://localhost:5000` (or the port you specified in `.env`).

### 3. Frontend Setup

Open a new terminal, navigate to the `frontend` directory, and install dependencies.

```bash
cd ../frontend
npm install
```

To start the frontend development server:

```bash
npm run dev
```

The frontend application will typically open in your browser at `http://localhost:5173` (or another available port).

## API Documentation

### Authentication API

*   **POST /api/auth/signup**
    *   **Description:** Registers a new user.
    *   **Request Body:** `{ "name": "string", "email": "string", "password": "string" }`
    *   **Response:** `{ "token": "string", "user": { "_id": "string", "name": "string", "email": "string" } }`

*   **POST /api/auth/login**
    *   **Description:** Logs in an existing user.
    *   **Request Body:** `{ "email": "string", "password": "string" }`
    *   **Response:** `{ "token": "string", "user": { "_id": "string", "name": "string", "email": "string" } }`

### Books API

*   **POST /api/books**
    *   **Description:** Adds a new book.
    *   **Authentication:** Required (JWT in Authorization header).
    *   **Request Body:** `{ "title": "string", "author": "string", "description": "string", "genre": "string", "year": "number" }`
    *   **Response:** The created book object.

*   **GET /api/books**
    *   **Description:** Retrieves a paginated list of books.
    *   **Query Parameters:**
        *   `page` (number, optional): The page number for pagination.
        *   `search` (string, optional): A search term to filter books by title or author.
        *   `genre` (string, optional): A genre to filter books by.
        *   `sort` (string, optional): Set to "year" to sort by year.
    *   **Response:** `{ "books": [...], "page": "number", "totalPages": "number" }`

*   **GET /api/books/:id**
    *   **Description:** Retrieves a single book by its ID.
    *   **Response:** The book object.

*   **PUT /api/books/:id**
    *   **Description:** Updates a book's details.
    *   **Authentication:** Required (JWT in Authorization header). Only the user who added the book can update it.
    *   **Request Body:** `{ "title": "string", "author": "string", "description": "string", "genre": "string", "year": "number" }`
    *   **Response:** The updated book object.

*   **DELETE /api/books/:id**
    *   **Description:** Deletes a book.
    *   **Authentication:** Required (JWT in Authorization header). Only the user who added the book can delete it.
    *   **Response:** `{ "message": "Book removed" }`

### Reviews API

*   **POST /api/reviews/:bookId**
    *   **Description:** Adds a review to a book.
    *   **Authentication:** Required (JWT in Authorization header).
    *   **Request Body:** `{ "rating": "number", "reviewText": "string" }`
    *   **Response:** The created review object.

*   **PUT /api/reviews/:id**
    *   **Description:** Updates a review.
    *   **Authentication:** Required (JWT in Authorization header). Only the user who created the review can update it.
    *   **Request Body:** `{ "rating": "number", "reviewText": "string" }`
    *   **Response:** The updated review object.

*   **DELETE /api/reviews/:id**
    *   **Description:** Deletes a review.
    *   **Authentication:** Required (JWT in Authorization header). Only the user who created the review can delete it.
    *   **Response:** `{ "message": "Review removed" }`

*   **GET /api/reviews/book/:bookId**
    *   **Description:** Retrieves all reviews for a specific book, along with the average rating.
    *   **Response:** `{ "reviews": [...], "averageRating": "number" }`

*   **GET /api/reviews/book/:bookId/distribution**
    *   **Description:** Retrieves the rating distribution (1-5 stars) for a specific book.
    *   **Response:** `{ "distribution": [0, 0, 0, 0, 0] }`

## Usage

Once both the frontend and backend servers are running:

1.  **Register/Login:** Create a new account or log in with existing credentials.
2.  **Browse Books:** View a list of available books.
3.  **Add Books:** (If authenticated) Add new books to the collection.
4.  **Review Books:** (If authenticated) Submit reviews and ratings for books.
5.  **Toggle Theme:** Use the theme switch in the navigation bar to change between light and dark modes.

## Folder Structure

```
Book_Review_App/
├───backend/                  # Node.js/Express backend
│   ├───config.js             # Database configuration
│   ├───middleware/           # Authentication middleware
│   ├───models/               # Mongoose models (User, Book, Review)
│   ├───routes/               # API routes (auth, books, reviews)
│   ├───server.js             # Main backend server file
│   └───.env                  # Environment variables
└───frontend/                 # React.js frontend
    ├───public/               # Static assets
    ├───src/                  # React source code
    │   ├───assets/           # Images, icons
    │   ├───components/       # Reusable React components
    │   ├───context/          # React Context for Auth and Theme
    │   ├───pages/            # Page-level components
    │   └───utils/            # Utility functions (e.g., API calls)
    ├───index.html            # Main HTML file
    ├───package.json          # Frontend dependencies
    └───vite.config.js        # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details. (Note: A `LICENSE` file is not included in the current directory structure. You may want to add one.)