# Candidate Management and Voting API

A **Candidate Management and Voting API** built using **Node.js**, **Express.js**, and **MongoDB**. This system allows for managing candidates, registering users, and enabling voting functionality, while ensuring roles (admin and user) and vote restrictions (e.g., admins cannot vote).

## Features

- **Admin Features**:
  - **Create** new candidates (name, party, age).
  - **Update** existing candidates.
  - **Delete** candidates.

- **User Features**:
  - **Register** and **Login** via mobile number and Aadhar card.
  - **Vote** for a candidate (only one time).

- **Vote Count**: 
  - Displays candidates in descending order of votes.

## Tech Stack

  - Node.js
  - Express.js
  - MongoDB
  - JWT for authentication
  - bcryptjs for password hashing
## API Endpoints

### User Routes

- `POST /user/signup`: Register a new user (name, password, mobile number, Aadhar card number, role).
- `POST /user/login`: Login a user using Aadhar card number and password.
- `GET /user/profile`: Get the logged-in user's profile (logged-in required).
- `POST /user/profile/password`: Update the user's password (logged-in required).

### Candidate Routes

- `POST /candidate`: Create a new candidate (Admin only).
- `PUT /candidate/:candidateId`: Update a candidate's details (Admin only).
- `DELETE /candidate/:candidateId`: Delete a candidate (Admin only).
- `POST /candidate/vote/:candidateId`: Vote for a candidate (User only).
- `GET /candidate/vote/count`: Get the vote count for all candidate

  

