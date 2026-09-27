# Multi-Service Marketplace Booking Platform

A premium, modern multi-service marketplace and booking platform designed to connect customers with a vast array of local businesses. Featuring a sleek dark-mode glassmorphism UI, robust backend architecture, and seamless booking flows, this platform supports **18 different service categories** out of the box.

## 🚀 Features

- **Multi-Category Support:** Handles 18 distinct business types, each with tailored UI and service structures.
- **Role-Based Access Control (RBAC):** Dedicated dashboards and flows for `CUSTOMER`, `BUSINESS_OWNER`, and `ADMIN`.
- **Advanced Booking System:** Real-time availability checks, concurrency prevention, and status tracking (Pending, Confirmed, Completed).
- **Premium Aesthetics:** Stunning dark-themed UI featuring glass panels, neon accents, and responsive layouts.
- **Dynamic Services & Products:** Business owners can list both bookable services and shippable products.

## 💻 Tech Stack

- **Frontend:** React, Vite, React Router, Axios, CSS Modules (Glassmorphism design)
- **Backend:** Node.js, Express, JSON Web Tokens (JWT) for authentication
- **Database:** Prisma ORM, SQLite (Ready to scale to PostgreSQL/MySQL)

## 📸 Categories & Screenshots

*(Please capture screenshots of your frontend for each category and place them in a `docs/screenshots` folder to display them here!)*

### 1. Beauty & Wellness
| 💈 Barber | 💇‍♀️ Women's Salon | 💄 Cosmetics | 💆 Spa |
|:---:|:---:|:---:|:---:|
| ![Barber](./docs/screenshots/barber.jpg) | ![Salon](./docs/screenshots/salon.jpg) | ![Cosmetics](./docs/screenshots/cosmetics.jpg) | ![Spa](./docs/screenshots/spa.jpg) |

### 2. Food & Dining
| ☕ Café | 🍽️ Restaurant |
|:---:|:---:|
| ![Cafe](./docs/screenshots/cafe.jpg) | ![Restaurant](./docs/screenshots/restaurant.jpg) |

### 3. Automotive & Transport
| 🚗 Car Wash | 🅿️ Parking | 🚕 Transportation | 📦 Local Delivery |
|:---:|:---:|:---:|:---:|
| ![Car Wash](./docs/screenshots/car_wash.jpg) | ![Parking](./docs/screenshots/parking.jpg) | ![Transport](./docs/screenshots/transport.jpg) | ![Delivery](./docs/screenshots/delivery.jpg) |

### 4. Home & Maintenance
| 🧹 Cleaning | 🔧 Home Repair |
|:---:|:---:|
| ![Cleaning](./docs/screenshots/cleaning.jpg) | ![Repair](./docs/screenshots/repair.jpg) |

### 5. Health & Fitness
| 🏋️ Gym | 🩺 Healthcare | 💊 Pharmacy |
|:---:|:---:|:---:|
| ![Gym](./docs/screenshots/gym.jpg) | ![Healthcare](./docs/screenshots/healthcare.jpg) | ![Pharmacy](./docs/screenshots/pharmacy.jpg) |

### 6. Education, Travel & Events
| 🎓 Tutors | 🏨 Hotel | 🎟️ Events/Tickets |
|:---:|:---:|:---:|
| ![Tutors](./docs/screenshots/tutors.jpg) | ![Hotel](./docs/screenshots/hotel.jpg) | ![Events](./docs/screenshots/events.jpg) |


## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/multi-service-marketplace.git
   cd multi-service-marketplace
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   
   # Set up environment variables (.env)
   # PORT=5000
   # JWT_SECRET=your_secret_here
   # DATABASE_URL="file:./dev.db"

   # Initialize database
   npx prisma generate
   npx prisma db push

   # Run the server (preferably with nodemon)
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Start the Vite development server
   npm run dev
   ```

4. **Open the App**
   Navigate to `http://localhost:5173` in your browser.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is licensed under the MIT License.