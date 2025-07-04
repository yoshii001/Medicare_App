# Medicare_App

A web application for managing medical care workflows for doctors, patients, and clinics. Medicare_App streamlines clinic operations with secure authentication, robust CRUD modules, and AI-powered assistance.

## Features
- Doctor, Patient, and Clinic CRUD modules
- Secure authentication (Email/Password & Google OAuth via Firebase)
- Serverless backend with Firebase Realtime Database
- AI-driven report suggestions using Google Gemini API
- Conversational chatbot for natural-language queries
- Firebase Hosting for fast and secure deployment

## System Architecture & Tech Stack
- Frontend: React.js (JavaScript/TypeScript)
- Backend: Firebase Realtime Database (serverless)
- Authentication: Firebase Authentication (Email/Password & Google OAuth)
- AI Integration: Google Gemini API (for report suggestions)
- Hosting: Firebase Hosting

## High-Level Project Flow
1. Project Setup & Authentication: Set up Firebase backend and authentication before developing CRUD modules.
2. Doctor Module: Depends on authentication; enables doctor management.
3. Patient Module: Requires authentication and existing data models.
4. Clinic Module: Relies on doctor and patient data.
5. AI & Chatbot: Integrated after CRUD modules are functional.

## CRUD Modules
### Doctor Management
- Actions: Create, Read, Update, Delete medical information.
- Roles: Specialists & Clinic-type doctors.
- Features: View patient records, update treatment notes.

### Patient Management
- Actions: Create, Read, Update, Delete patient profiles.
- Extras: Auto-generate unique Patient ID, generate report cards.

### Clinic Management
- Actions: Create/Delete clinic locations, assign doctors.
- Calendar: Add/view daily time slots in calendar format.
- Appointments: Assign patients to available slots.

## AI & Chatbot
- AI Suggestions: Doctors generate patient reports using Gemini API.
- Chatbot: Query clinic data in natural language (e.g., "Next available slot for Dr. X?").
- Storage: All AI interactions are logged in the Firebase Realtime Database.

## Getting Started
1. Clone the repository
```sh
git clone https://github.com/yoshii001/Medicare_App.git
```
2. Install dependencies
```sh
npm install
```
3. Configure Firebase: Set up your Firebase project and add your configuration to the project.
4. Run the app
```sh
npm run dev
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)