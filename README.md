## How to Run the Project (Local Development)

This project uses:

    1. Vite for fast development

    2. MSW (Mock Service Worker) for backend simulation

    3. Zustand for state management

    3. React Router for navigation

Follow these steps to run it locally:

    1. Clone the repository
        git clone https://github.com/Ratiksha/solstice-technical-test.git
        cd solstice-technical-test
    2. Install dependencies
        npm install
    3. Create a .env file
        Inside the root folder, create a file named .env and paste the content I have shared in the text file attached.
    4. Start the development server
        npm run dev
    5. The app will start at
        http://localhost:5173
    6. Run Tests
        npm run test
    7. To view test coverage
        npx vitest --coverage

## Login Credentials 
    Email: demo@gmail.com  
    Password: qwerty

## Why I chose MSW instead of building a real backend

When approaching this assignment, I had two options:

    1. Build a real backend (authentication, token refresh, upload endpoints)

    2. Or use a mock backend that behaves exactly like a real API

I chose MSW (Mock Service Worker) for this project because it lets me simulate a fully realistic backend without spending time writing server code. Given the time constraints, this allowed me to focus on the parts of the assignment that actually measure my frontend engineering ability:

    1. authentication flow

    2. token management + automatic refresh

    3. protected routes

    4. upload concurrency engine

    5. retry / cancel logic

    6. global error handling

    7. clean state management

    8. test coverage

    9. modular, scalable architecture

In other words, I spent time on the parts that reveal engineering judgement, rather than backend boilerplate.

I have built fully functional app backends before (for example, my Icons App (https://icons-app-three.vercel.app/), where everything from login to data persistence works end-to-end). So I did not avoid building a backend out of difficulty — only because it would dilute the focus of the assignment.

## Why I did not deploy this project on Vercel

The project works perfectly in local development because MSW runs as a service worker.
However, MSW intentionally disables itself in production builds.
That means:

npm run dev → backend mocks work  
npm run build → mocks disabled  
Vercel → runs the production build


As soon as the project goes live, the mock backend shuts off, so:

/auth/login

/auth/refresh

/api/upload

no longer have an API responding.

Instead of trying to hack MSW to run in production or rush a backend, I kept the focus on the engineering parts of the assignment — and documented this trade-off here, as instructed.


## What I prioritized instead (the parts that matter)

To make the most meaningful use of the time, I concentrated on:

# Authentication

JWT token handling

persistent login state

refresh token workflow

automatic logout on invalid token

# Upload System

drag & drop + file picker

file validation

upload queue

max 3 concurrent uploads

cancel individual/all uploads

retry failed uploads

fake progress simulation

error states and recovery

# Architecture & Code Structure

API layer separated

clean Zustand stores

upload engine fully isolated

components modular and reusable

constant-driven configuration

lazy-loaded pages

# Testing

component testing

store testing

upload list testing

authentication flow testing

## If I had more time, I would add:

A real backend (Node)

File preview thumbnails (PDF/TXT)

Error boundary UI

Cover 70% test coverage

Working backend (Here is my vercel uploaded site, but due to MSW the api will not work https://document-upload-manager.vercel.app/)

## Summary

I intentionally chose MSW, not because I cannot build a backend, but because it allowed me to spend the limited time on the parts of the assignment that truly showcase frontend skills.

My focus was on quality, performance, modularity, and test coverage — all of which reflect how I would design production features in a real project.