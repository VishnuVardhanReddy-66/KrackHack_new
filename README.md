🚀 AEGIS – The Unified Digital Citadel
Before we start
when we run it on ide once the site opens in the local server 
u need login id and pass 
enter any roll numer of our clg :-
eg.B25191 password will be (191 the last 3 digits)
for faculty:-
eg.,
f001 - name 
pass - 001

for admin:-
only one account:-
name - Error
pass - 404

🏛 Overview

AEGIS is a full-stack web ecosystem built for KrackHack under The AEGIS Protocol challenge.

It integrates governance, academics, grievances, opportunities, and competitive coding into one unified digital platform.

🔴 Core Pillars Implemented
✅ Pillar I – Identity & Governance

Role-Based Authentication (Student, Faculty, Authority, Admin)

Institute email restriction

Password hashing

Secure session management

RBAC enforcement

Admin analytics dashboard

✅ Pillar II – Voice (Grievance Management)

Anonymous grievance submission

Categorization & priority tagging

Location tagging

Image upload

Status tracking workflow

Authority dashboard

Timeline tracking

Analytics overview

✅ Pillar III – Fate (Academic Mastery)

Course enrollment tracker

Credit calculator

Attendance logger

PYQ repository

Academic calendar with reminders

✅ Pillar IV – Opportunity

Faculty internship posting

Student application system

Resume upload

Status tracking

Bookmarking

Personal task manager

🟢 Bonus Features

🎯 Contests Tab (Codeforces & LeetCode integration)

🌙 Dark Mode

📊 Analytics dashboards

📱 Fully responsive UI

🛠 Tech Stack

🌐 The Frontend:
Framework: React (Vite/Next.js) – AI Studio typically generates a high-performance React application. It uses a component-based architecture, which is why you can see separate files for your Dashboard, GrievanceForm, and Navigation.

Styling: Tailwind CSS – This is what gives your site that "glassmorphic" and clean look without writing thousands of lines of custom CSS. It uses utility classes (like bg-white/10 backdrop-blur) for speed.

Icons: Lucide React – Those sharp, minimalist icons you’re using (like the home or user icons) come from this library.

⚙️ The Backend: "The Logic Layer"

Runtime: Node.js – Everything in the background is running on Node.js, which is why you can install npm packages.

Database: Firestore (NoSQL) – For features like your "Grievance Portal," the AI typically sets up Firestore. It’s a flexible database that stores your data in "Documents" (e.g., a specific complaint) and "Collections" (e.g., all grievances).

🧠 The Intelligence: "The Brain"
Model: Gemini 3 Flash – This is the engine doing the actual coding. It’s multimodal, meaning it "sees" your UI and "writes" the logic to match.

Integration: Genkit / Firebase AI Logic – You are using Google's new middleware that connects your React frontend directly to the Gemini API securely without needing a complex backend server.

Authentication:

JWT / Sessions

Deployment:

Vercel / Railway / etc.

⚙ Setup Instructions
1️⃣ Clone Repository
git clone <repo-link>
cd aegis

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create .env file:

DATABASE_URL=
JWT_SECRET=
EMAIL_SERVICE=

4️⃣ Run Development Server
npm run dev

🔐 Test Credentials

Student:
email:
password:

Faculty:
email:
password:

Authority:
email:
password:

Admin:
email:
password:

📊 Database Schema

Users

Grievances

Courses

Opportunities

Applications

Tasks

Announcements

📈 Future Improvements

AI-powered recommendations

Push notifications

Mobile app
