# POS System Demo

A demo **Point-of-Sale (POS) system backend** built with **Node.js, Express, and MongoDB**, featuring:

- **User Authentication**: Register, Login, Logout with JWT-based authentication
- **Role-based Access Control**: Admin and User roles
- **Product Management**: CRUD operations on products
- **Secure API**: Rate limiting, input validation, JWT authentication
- **Pagination & Search**: Fetch product list with optional search & paging

This project is meant as a **practice/demo backend** for learning and testing.

---

## **Features**

### User Management
- **Register** a new user
- **Login** with JWT
- **Logout**
- **Profile management** (update name, email, password)
- **Admin controls**: update/delete any user, manage roles

### Product Management
- **Create, Update, Delete products** (Admin only)
- **View product list** (all users)
- **Search and pagination** supported

### Security
- **JWT authentication** with token storage for logout
- **Rate limiting** on login endpoint to prevent brute-force attacks
- **Helmet** for HTTP security headers
- **CORS configured** for frontend integration

---

## **Tech Stack**

- **Node.js** - Server runtime
- **Express.js** - API framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Helmet & CORS** - Security headers and cross-origin handling
- **Express Rate Limit** - Brute-force protection

---

## **Project Structure**

```

.
├── src/
│   ├── routes/
│   │   ├── auth.js
│   │   └── products.js
│   ├── models/
│   │   ├── users.js
│   │   └── products.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   └── authorize.js
│   ├── server.js
│   └── config/
│       └── index.js
├── .env
├── package.json
└── README.md

````

---

## **Setup**

1. **Clone the repository**
```bash
git clone https://github.com/codeshark-lucifer/pos-system-demo.git
cd pos-system-demo
````

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

```env
DB_URI=mongodb://username:password@host:port/dbname
JWT_SECRET=supersecret
JWT_EXPIRE=1h
```

4. **Run the server**

```bash
npm run dev   # for development with nodemon
npm start     # for production
```

Server will run on `http://localhost:5000` (or the port you set).

---

## **API Endpoints**

### Auth Routes

| Method | Endpoint       | Description               | Access |
| ------ | -------------- | ------------------------- | ------ |
| POST   | /auth/register | Register a new user       | Public |
| POST   | /auth/login    | Login and get JWT         | Public |
| POST   | /auth/logout   | Logout (invalidate token) | Auth   |

### Product Routes

| Method | Endpoint            | Description                         | Access     |
| ------ | ------------------- | ----------------------------------- | ---------- |
| POST   | /product/create     | Create a new product                | Admin only |
| PUT    | /product/update/:id | Update a product                    | Admin only |
| DELETE | /product/remove/:id | Delete a product                    | Admin only |
| GET    | /product/list       | List products (search + pagination) | Public     |

---

## **Contributing**

This is a **demo project** for learning purposes. Feel free to fork and experiment!

---

## **License**

MIT License
```
@mormleapsovann
```
