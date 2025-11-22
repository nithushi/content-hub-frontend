# 📝 Content Hub
### The Modern Social Blogging Platform

![Angular](https://img.shields.io/badge/Angular-19.2.19-dd0031?style=for-the-badge&logo=angular)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6db33f?style=for-the-badge&logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Used-336791?style=for-the-badge&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Content Hub** is a sleek, full-stack social blogging application designed for creators to share thoughts and engage with readers. Built with **Angular 19** and a **Spring Boot** backend, using **PostgreSQL** for data storage.

---

## ✨ Features

### 🎨 Frontend (Angular 19)
* **Standalone Components:** Modern architecture using the latest Angular standards.
* **Reactive State:** Smooth UI updates using Observables.
* **Secure Authentication:** JWT-based login/registration.
* **Rich Interactions:** Create posts, comment threads, likes, and pinning.
* **User Profiles:** Customizable profiles with avatars.

### ⚙️ Backend (Spring Boot)
* **RESTful API:** Efficient endpoints for content management.
* **Database:** PostgreSQL.
* **File Handling:** Optimized image storage.
* **Security:** Role-based access control.

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js** (v18+)
* **Java JDK** (17 or 21)
* **PostgreSQL**

### 2. Database Setup
Create a database named `content_hub`:

```sql
CREATE DATABASE content_hub;
```

3. Backend Setup
Navigate to the backend folder.

Update application.properties with your PostgreSQL credentials.

Run the application:

Bash

mvn spring-boot:run
4. Frontend Setup
Navigate to the frontend folder.

Install dependencies and start the server:

Bash

npm install
ng serve
Visit: http://localhost:4200

📂 Project Structure
Bash

content-hub-frontend/
├── src/
│   ├── app/
│   │   ├── guards/       # Auth Guards
│   │   ├── interceptors/ # Token Interceptor
│   │   ├── pages/        # Home, Login, Profile, Create-Post
│   │   └── services/     # API Services
│   └── ...
👀 Screenshots
1. Home Feed
<img width="768" height="1380" alt="screencapture-localhost-4200-2025-11-22-21_17_32" src="https://github.com/user-attachments/assets/5ffb9b94-d7d9-4fba-b311-1b635414048a" />

3. Content Details
<img width="768" height="2415" alt="screencapture-localhost-4200-post-3-2025-11-22-21_18_14" src="https://github.com/user-attachments/assets/e4a3a1f2-75a9-42ed-aa7e-3c0b5a3b2853" />

   
Made by [Nithushi Shavindi]
