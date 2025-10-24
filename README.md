# SecureApp -  Zero Trust Architecture

### A production-ready MERN stack application implementing Zero Trust security architecture with role-based access control, JWT authentication, and cloud-native deployment.

---
## Table of Contents

1. [Overview](#overview)  
2. [Architecture](#architecture)  
3. [Tech Stack](#tech-stack)  
4. [Prerequisites](#prerequisites)   
5. [Local Development (Quick Start)](#local-development-quick-start)  

---

## Overview

SecureApp demonstrates a **Zero Trust** architecture for modern web applications:

- No implicit trust between components — every request is authenticated and authorized.
- JWTs issued by the Auth Service and verified by the Auth Proxy.
- RBAC enforced at each service boundary.
- Built for production deployment with microservices, CI/CD, and cloud scaling.

---

## Architecture
```
Frontend (React/Vercel) → Auth Proxy → Auth Service → MongoDB
                              ↓          Resource Service
                           Zero Trust
                          JWT + RBAC
```
**Key Components**

- **Auth Proxy** – API gateway validating JWTs, applying rate limits, enforcing CORS, and RBAC checks.  
- **Auth Service** – Handles identity management, credential verification, and token issuance.  
- **Resource Service** – Exposes domain-specific protected APIs, verifying JWTs per request.  
- **Frontend (React)** – Uses Axios to communicate securely with the Auth Proxy.

---

## Tech Stack

**Frontend:** React (Hooks, React Router, Axios)  
**Backend:** Node.js (v18+), Express, MongoDB, Mongoose  
**Security:** JWT, bcrypt, helmet, express-rate-limit  
**Cloud:** Azure App Services, Cosmos DB, Vercel  
**DevOps:** GitHub Actions, optional Docker & Kubernetes

---

## Prerequisites

- Node.js 18+ and npm  
- MongoDB 6+ (local or cloud — CosmosDB or MongoDB Atlas)  
- Azure CLI (for deployment)  
- Vercel CLI (for frontend deployment)  
- Git and GitHub account  
- Optional: Docker for containerized testing

---

---

## Local Development (Quick Start)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/secureapp.git
cd secureapp

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Install backend dependencies
cd ../backend/auth-proxy && npm install
cd ../services/auth-service && npm install
cd ../services/resource-service && npm install

```
---

#### Run all services
```bash
# Auth Service
cd backend/services/auth-service
npm src/server.js

# Resource Service
cd ../resource-service
npm src/server.js

# Auth Proxy
cd ../../auth-proxy
npm src/server.js

# Frontend
cd ../../../frontend
npm start
```


