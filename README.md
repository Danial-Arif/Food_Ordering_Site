<p align="center">
  <strong style="font-size:2rem;">dine with <span>dane</span></strong>
</p>

<h3 align="center">🍽️ Where Every Meal Becomes a Memory</h3>

<p align="center">
  A modern, full-stack food ordering web application built with <b>Next.js 16</b>, <b>MongoDB</b>, and a stunning dark-themed UI.<br/>
  Browse curated dishes, add to cart, place orders, and manage everything from a sleek admin dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
</p>

---

## ✨ Features

### 🧑‍🍳 Customer Experience
- **Cinematic Landing Page** — Parallax hero with background video, animated text marquee, and smooth scroll effects
- **Interactive Menu** — Browse by category (Starters, Mains, Desserts, Drinks), search & filter items in real-time
- **Shopping Cart** — Slide-out cart drawer with quantity controls and live price calculation
- **Secure Checkout** — JWT-authenticated ordering with order summary
- **Reviews & Ratings** — Leave star ratings and reviews for menu items
- **Contact Page** — Reach out via a clean contact form
- **Fully Responsive** — Gorgeous on desktop, tablet, and mobile with a full-screen mobile menu

### 🔐 Admin Dashboard
- **Dashboard Overview** — View total orders, revenue, menu item count, and pending orders at a glance
- **Menu Management** — Add, edit, and delete menu items with image uploads via Cloudinary
- **Order Management** — Track and update order statuses (Pending → Preparing → Delivered)
- **Role-Based Access** — Admin-only routes protected by JWT authentication

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, Tailwind CSS 4, Custom CSS |
| **Backend** | Next.js API Routes |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT + bcryptjs |
| **Image Storage** | Cloudinary |
| **Icons** | React Icons (BoxIcons) |
| **Fonts** | Google Fonts (Geist, Instrument Serif, Space Mono) |

---

## 📁 Project Structure

```
dine-with-dane/
├── app/
│   ├── admin/              # Admin dashboard, menu & order management
│   │   ├── menu/
│   │   └── orders/
│   ├── api/                # RESTful API routes
│   │   ├── auth/           # Login & Signup endpoints
│   │   ├── menu/           # CRUD for menu items
│   │   ├── orders/         # Order creation & management
│   │   ├── reviews/        # Review submission
│   │   ├── seed/           # Database seeding
│   │   └── upload/         # Cloudinary image upload
│   ├── checkout/           # Checkout page
│   ├── contact/            # Contact page
│   ├── login/              # Login page
│   ├── menu/               # Public menu browsing
│   ├── signup/             # Signup page
│   ├── globals.css         # Design system & global styles
│   ├── layout.tsx          # Root layout with font configuration
│   └── page.tsx            # Landing page
├── components/             # Reusable UI components
│   ├── navbar.jsx          # Responsive navigation bar
│   ├── cart-provider.jsx   # Cart context provider
│   ├── cart-drawer.jsx     # Slide-out cart drawer
│   ├── menu-card.jsx       # Menu item card component
│   ├── menu-search.jsx     # Search & filter component
│   ├── review-modal.jsx    # Review submission modal
│   ├── about.jsx           # About section
│   └── video.jsx           # Background video component
├── lib/                    # Utilities
│   ├── auth.js             # JWT helpers
│   └── mongodb.js          # MongoDB connection
├── models/                 # Mongoose schemas
│   ├── Order.js
│   ├── Review.js
│   └── User.js
└── scripts/                # Database seed scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/Danial-Arif/Food_Ordering_Site.git
cd Food_Ordering_Site
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Seed the Database (Optional)

Navigate to `http://localhost:3000/api/seed` after starting the dev server to populate the database with sample menu items.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enjoy! 🎉

---

## 🎨 Design Philosophy

Dine with Dane features a **premium dark-themed UI** inspired by high-end restaurant websites:

- **Color Palette** — Deep blacks with warm gold accents (`#D4A853`)
- **Typography** — Elegant combination of Instrument Serif for headings, Geist for body text, and Space Mono for labels
- **Glassmorphism** — Frosted glass card effects with subtle backdrop blur
- **Micro-Animations** — Smooth fade-ups, scale transitions, and hover effects throughout
- **Responsive Design** — Full-screen mobile menu with viewport-scaled typography

---

## 📜 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/menu` | Fetch all menu items |
| `POST` | `/api/menu` | Add a menu item (Admin) |
| `PUT` | `/api/menu/[id]` | Update a menu item (Admin) |
| `DELETE` | `/api/menu/[id]` | Delete a menu item (Admin) |
| `GET` | `/api/orders` | Fetch all orders (Admin) |
| `POST` | `/api/orders` | Place a new order |
| `PUT` | `/api/orders/[id]` | Update order status (Admin) |
| `POST` | `/api/reviews` | Submit a review |
| `POST` | `/api/upload` | Upload image to Cloudinary |

---

## 👤 Author

**Danial Arif**

- GitHub: [@Danial-Arif](https://github.com/Danial-Arif)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ and a whole lot of chai ☕
</p>
