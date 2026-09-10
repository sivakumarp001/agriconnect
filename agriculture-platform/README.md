# AgroConnect — Integrated Digital Agriculture Platform

A MERN final-year project that brings direct agricultural commerce, machinery rental, farmer collaboration, and administrative oversight into one responsive application.

## Folder structure

```text
agriculture-platform/
├── backend/
│   ├── config/db.js
│   ├── controllers/{adminController,authController,crudController}.js
│   ├── middleware/{auth,error,upload}.js
│   ├── models/{User,Product,Equipment,Order,RentalRequest,Post,Comment}.js
│   ├── routes/routes.js
│   ├── uploads/                 # created product/equipment/profile images
│   ├── utils/seedAdmin.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/{Layout,Protected}.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/Pages.jsx
│   │   ├── services/api.js
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
└── README.md
```

## Features

- JWT authentication with hashed passwords and four roles: farmer, buyer, rental owner, and administrator.
- Products with image upload, search, shopping cart, checkout, and farmer/admin order status updates.
- Equipment listings, image uploads, availability, rental requests, and rental-owner accept/reject workflow.
- Farmer posts and comments, plus administrative content and account management endpoints.
- Role-aware React dashboard, Bootstrap responsive UI, API error feedback, and protected routes.

## Requirements

- Node.js 18+
- MongoDB Community Server, or a MongoDB Atlas connection string

## Install and run

1. Open two terminals at the project root.

2. Configure the backend.

   ```powershell
   cd backend
   Copy-Item .env.example .env
   npm install
   npm run seed
   npm run dev
   ```

   Update `MONGODB_URI` and the JWT secret in `backend/.env` before production use. `npm run seed` creates the administrator from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in that file.

3. Configure and start the frontend.

   ```powershell
   cd frontend
   Copy-Item .env.example .env
   npm install
   npm run dev
   ```

4. Open the Vite address shown in the terminal, normally `http://localhost:5173`.

## Manual testing guide

1. Register one farmer, buyer, and equipment-rental-owner account.
2. Sign in as the farmer and add a product with an image; confirm it appears in Marketplace.
3. Sign in as buyer, add that product to Cart, place an order, then verify it appears in My Orders and farmer Orders Received.
4. Sign in as rental owner, list equipment; as farmer request it from Equipment. Accept/reject it as the owner.
5. As farmer create a Community post and add comments as any signed-in user.
6. Use the seeded admin account to review dashboard statistics, user management, all orders, and rental records.

## API overview

All APIs use the `/api` prefix. Protected requests require `Authorization: Bearer <JWT>`.

| Resource | Main routes |
| --- | --- |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Users | `PUT /users/profile` |
| Products | `GET/POST /products`, `GET/PUT/DELETE /products/:id` |
| Equipment | `GET/POST /equipment`, `GET/PUT/DELETE /equipment/:id` |
| Orders | `GET/POST /orders`, `PUT /orders/:id/status` |
| Rentals | `GET/POST /rentals`, `PUT /rentals/:id/status` |
| Community | `GET/POST /posts`, comments under `/posts/:postId/comments` |
| Administration | `/admin/stats`, `/admin/users`, `/admin/content` |

Images are stored locally under `backend/uploads` and served from `/uploads/<filename>`. For deployment, replace this with cloud storage and use HTTPS, a managed MongoDB instance, a strong random `JWT_SECRET`, and restricted CORS origins.
