# 📚 Book Knowledge Nest (formerly KnowledgeNest)

![Project Status](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Supabase-teal?style=for-the-badge)

**Book Knowledge Nest** is a high-performance, community-driven platform designed to revolutionize knowledge sharing and book rental services. Built on a modern decoupled architecture, it empowers accessible learning through real-time collaboration and seamless book discovery.

---

## 🏗️ Architecture & Design

Book Knowledge Nest utilizes a **Headless Architecture** where the frontend is completely decoupled from the data layer. We leverage **Supabase** for immediate, secure authentication and data persistence.

### High-Level System Design
```
graph TD
    Client[User / Browser] -->|HTTPS| CDN[Vite / Edge Network]
    Client -->|REST / Realtime| Auth[Supabase Auth]
    Client -->|Queries| DB[(Supabase Database)]
    
    subgraph Frontend Logic
    CDN --> Router[React Router]
    Router --> Pages[Pages: Home, BookDetails, Login]
    Pages --> Context[Auth Context & State]
    end
    
    subgraph Data Layer
    Auth --> Users[User Management]
    DB --> Books[Book Inventory]
    DB --> Rentals[Rental Transactions]
    end
Authentication Flow (Secure Access)
The application implements a robust security flow supporting Email/Password, Magic Links, and OAuth (Google).

Code snippet

sequenceDiagram
    participant User
    participant App as React App
    participant Supabase as Supabase Auth

    User->>App: Clicks Login
    alt Google OAuth
        App->>Supabase: Request OAuth Provider (Google)
        Supabase->>User: Redirect to Google Consent
        User->>Supabase: Grants Permission
        Supabase-->>App: Returns Session Token
    else Email/Password
        User->>App: Enters Credentials
        App->>Supabase: signInWithPassword()
        Supabase-->>App: Validates & Returns Session
    end
    App->>App: Update AuthContext
    App->>User: Redirect to Protected Dashboard
🚀 Tech Stack
Frontend (Client Side)
Core: React 18 + TypeScript (Strict Mode)

Build Tool: Vite (SWC) for lightning-fast HMR.

Styling: Tailwind CSS for utility-first responsive design.

Icons: Lucide React.

Routing: React Router v6 (Protected Route implementation).

Backend-as-a-Service (Data Layer)
Supabase:

Auth: Handling JWTs, OAuth (Google), and Password Resets.

Database: PostgreSQL (Relation data for Books/Rentals).

Row Level Security (RLS): Granular data protection.

⚡ Key Features
🔐 Authentication Suite: Full flows for Sign Up, Login, and secure Logout.

🛡️ Protected Routes: "Guard" components that prevent unauthorized access to private pages.

🔑 Password Recovery: Secure "Forgot Password" flow using OTP verification.

🌐 Google Integration: One-click OAuth login via Google Cloud Console.

📱 Responsive UI: Mobile-first design using Tailwind Grid and Flexbox.

🔍 Dynamic Navigation: UI adapts based on user session state (e.g., Login vs Logout buttons).

🛠️ Getting Started
Follow these steps to set up the project locally.

1. Clone the Repository
Bash

git clone [https://github.com/YOUR_USERNAME/book-Knowledge Nest-web.git](https://github.com/YOUR_USERNAME/book-Knowledge Nest-web.git)
cd book-Knowledge Nest-web
2. Install Dependencies
Bash

npm install
3. Environment Configuration
Create a .env file in the root directory. You will need your Supabase API credentials.

Code snippet

VITE_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
VITE_SUPABASE_ANON_KEY=your-anon-key-here
4. Run the Development Server
Bash

npm run dev
Open http://localhost:5173 in your browser.

📂 Project Structure
We follow a Feature-First architecture to ensure scalability.

Plaintext

src/
├── components/       # Reusable UI (Buttons, Cards, Form elements)
│   ├── ProtectedRoute.tsx  # Security Guard
│   └── BookCard.tsx        # Display Component
├── context/          # Global State (AuthContext)
├── layouts/          # Page Wrappers (Navbar, Footer)
├── lib/              # External clients (Supabase setup)
├── pages/            # View Controllers
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── SignUp.tsx
│   ├── ForgotPassword.tsx
│   ├── UpdatePassword.tsx
│   └── BookDetails.tsx
├── types/            # TypeScript Interfaces
└── App.tsx           # Routing & Provider setup
🤝 Contributing
Fork the Project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your Changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request.

Developed with ❤️ for the Book Knowledge Nest Community.
