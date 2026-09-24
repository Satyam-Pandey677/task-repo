# HRMS API Documentation

This document provides a comprehensive guide to all REST APIs available in the Human Resource Management System (HRMS) backend application.

---

## Base URL

```text
http://localhost:8000/api
```

---

## Authentication

Authentication is handled via **JWT (JSON Web Tokens)**. Include the token in the `Authorization` header for protected endpoints:

```text
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## 1. User & Authentication Endpoints (`/api/user`)

### 1.1 User Login
- **Endpoint:** `POST /api/user/login`
- **Access:** Public
- **Description:** Authenticate user credentials and receive a JWT token.
- **Request Body:**
  ```json
  {
    "email": "admin@hrms.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "User login Successfully",
    "user": {
      "_id": "66f3a123bc45678901234567",
      "name": "Admin User",
      "email": "admin@hrms.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkXVCJ9..."
  }
  ```

---

### 1.2 Create User & Employee Profile
- **Endpoint:** `POST /api/user/create-user`
- **Access:** Admin / HR (Requires JWT)
- **Description:** Create a new user account and associated employee profile.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@hrms.com",
    "password": "Password@123",
    "role": "employee",
    "phone": "9876543210",
    "department": "66f3a987bc45678901234567",
    "designation": "Software Engineer",
    "joiningDate": "2024-01-15",
    "salary": 75000,
    "status": "Active"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "New Employee created successfully",
    "user": {
      "_id": "66f3b456bc45678901234568",
      "employeeID": "EMP-1002",
      "name": "John Doe",
      "email": "john.doe@hrms.com",
      "phone": "9876543210",
      "department": "66f3a987bc45678901234567",
      "designation": "Software Engineer",
      "joiningDate": "2024-01-15",
      "salary": 75000,
      "status": "Active",
      "user": "66f3b455bc45678901234567"
    }
  }
  ```

---

### 1.3 Update Password
- **Endpoint:** `POST /api/user/update-password`
- **Access:** Authenticated User
- **Description:** Update current user's password.
- **Request Body:**
  ```json
  {
    "oldPassword": "password123",
    "newPassword": "newSecurePassword@123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Password updated successfully"
  }
  ```

---

## 2. Employee Endpoints (`/api/employee`)

### 2.1 Get Current Profile
- **Endpoint:** `GET /api/employee/me`
- **Access:** Authenticated User
- **Description:** Fetch logged-in employee profile details.
- **Response (200 OK):**
  ```json
  {
    "mesasge": "Profile fetched successfull",
    "data": {
      "_id": "66f3b456bc45678901234568",
      "employeeID": "EMP-1001",
      "name": "John Doe",
      "phone": "9876543210",
      "designation": "Software Engineer",
      "joiningDate": "2024-01-15",
      "salary": 75000,
      "status": "Active",
      "user": {
        "_id": "66f3b455bc45678901234567",
        "email": "john.doe@hrms.com",
        "role": "employee"
      },
      "department": {
        "_id": "66f3a987bc45678901234567",
        "name": "Engineering"
      }
    }
  }
  ```

---

### 2.2 Get All Employees
- **Endpoint:** `GET /api/employee/all`
- **Access:** Authenticated User
- **Description:** List all employees with populated user & department details.
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "_id": "66f3b456bc45678901234568",
        "employeeID": "EMP-1001",
        "name": "John Doe",
        "designation": "Software Engineer",
        "salary": 75000,
        "status": "Active"
      }
    ]
  }
  ```

---

### 2.3 Get Employee Details by ID
- **Endpoint:** `GET /api/employee/:employeeId/details`
- **Access:** Admin / HR
- **Description:** Fetch detailed employee info along with full attendance history.
- **Response (200 OK):**
  ```json
  {
    "data": {
      "employee": {
        "_id": "66f3b456bc45678901234568",
        "name": "John Doe",
        "designation": "Software Engineer"
      },
      "attendance": [
        {
          "date": "2024-09-24T00:00:00.000Z",
          "status": "present",
          "checkIn": "2024-09-24T09:00:00.000Z",
          "checkOut": "2024-09-24T17:30:00.000Z"
        }
      ]
    }
  }
  ```

---

### 2.4 Update My Profile
- **Endpoint:** `PUT /api/employee/update-profile`
- **Access:** Authenticated User
- **Description:** Self-update editable profile details (name, phone).
- **Request Body:**
  ```json
  {
    "name": "Johnathan Doe",
    "phone": "9998887770"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Profile updated successfully",
    "data": { ... }
  }
  ```

---

### 2.5 Admin Update Employee Profile
- **Endpoint:** `PUT /api/employee/:employeeId/profile`
- **Access:** Admin / HR
- **Description:** Admin update employee profile fields (name, phone, department, designation, status, salary).
- **Response (200 OK):**
  ```json
  {
    "message": "Employee profile updated successfully",
    "data": { ... }
  }
  ```

---

### 2.6 Delete Employee
- **Endpoint:** `DELETE /api/employee/:employeeId`
- **Access:** Admin / HR
- **Description:** Delete employee profile, user account, and attendance records.
- **Response (200 OK):**
  ```json
  {
    "message": "Employee deleted successfully",
    "employeeId": "66f3b456bc45678901234568"
  }
  ```

---

## 3. Attendance Endpoints (`/api/employee/attendance`)

### 3.1 Check-In Today
- **Endpoint:** `POST /api/employee/attendance/check-in`
- **Access:** Authenticated User
- **Description:** Record check-in timestamp for current day.
- **Response (201 Created):**
  ```json
  {
    "message": "Check-in marked successfully",
    "data": {
      "employeeId": "66f3b456bc45678901234568",
      "status": "present",
      "checkIn": "2024-09-24T09:05:00.000Z"
    }
  }
  ```

---

### 3.2 Check-Out Today
- **Endpoint:** `PATCH /api/employee/attendance/check-out`
- **Access:** Authenticated User
- **Description:** Record check-out timestamp for current day.
- **Response (200 OK):**
  ```json
  {
    "message": "Check-out marked successfully",
    "data": {
      "employeeId": "66f3b456bc45678901234568",
      "status": "present",
      "checkIn": "2024-09-24T09:05:00.000Z",
      "checkOut": "2024-09-24T17:35:00.000Z"
    }
  }
  ```

---

### 3.3 Get Today's Attendance
- **Endpoint:** `GET /api/employee/attendance/today`
- **Access:** Authenticated User
- **Description:** Retrieve today's check-in/out record for logged-in employee.
- **Response (200 OK):**
  ```json
  {
    "data": {
      "status": "present",
      "checkIn": "2024-09-24T09:05:00.000Z",
      "checkOut": null
    }
  }
  ```

---

### 3.4 Get Attendance Statistics
- **Endpoint:** `GET /api/employee/attendance/stats`
- **Access:** Authenticated User
- **Description:** Get monthly working days, present days, and attendance percentage.
- **Response (200 OK):**
  ```json
  {
    "attendancePercentage": 95,
    "presentDays": 19,
    "workingDays": 20
  }
  ```

---

### 3.5 Get Monthly Attendance History / Calendar Data
- **Endpoint:** `GET /api/employee/attendance/history?month=9&year=2024`
- **Access:** Authenticated User
- **Query Parameters:** `month` (1-12), `year` (YYYY)
- **Response (200 OK):**
  ```json
  {
    "month": 9,
    "year": 2024,
    "data": [
      {
        "id": "66f3c111bc45678901234569",
        "date": "2024-09-01T00:00:00.000Z",
        "status": "present",
        "checkIn": "2024-09-01T09:00:00.000Z",
        "checkOut": "2024-09-01T17:00:00.000Z"
      }
    ],
    "leaves": []
  }
  ```

---

## 4. Leave Endpoints (`/api/employee/leave`)

### 4.1 Apply for Leave
- **Endpoint:** `POST /api/employee/leave`
- **Access:** Authenticated User
- **Request Body:**
  ```json
  {
    "startDate": "2024-10-01",
    "endDate": "2024-10-03",
    "reason": "Personal medical leave"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Leave request submitted",
    "data": {
      "_id": "66f3d222bc45678901234570",
      "employeeId": "66f3b456bc45678901234568",
      "startDate": "2024-10-01T00:00:00.000Z",
      "endDate": "2024-10-03T00:00:00.000Z",
      "reason": "Personal medical leave",
      "status": "pending"
    }
  }
  ```

---

### 4.2 Get Leave Requests
- **Endpoint:** `GET /api/employee/leave`
- **Access:** Authenticated User (Employees get own, Admin gets all)
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "_id": "66f3d222bc45678901234570",
        "reason": "Personal medical leave",
        "status": "pending"
      }
    ]
  }
  ```

---

### 4.3 Update Leave Status
- **Endpoint:** `PATCH /api/employee/leave/:leaveId/status`
- **Access:** Admin / HR
- **Request Body:**
  ```json
  {
    "status": "approved"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Leave request approved",
    "data": {
      "_id": "66f3d222bc45678901234570",
      "status": "approved"
    }
  }
  ```

---

## 5. Department Endpoints (`/api/department`)

### 5.1 Create Department
- **Endpoint:** `POST /api/department`
- **Access:** Admin / HR
- **Request Body:**
  ```json
  {
    "name": "Human Resources"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Department Created Successfully",
    "department": {
      "_id": "66f3e333bc45678901234571",
      "name": "Human Resources"
    }
  }
  ```

---

### 5.2 Get All Departments
- **Endpoint:** `GET /api/department`
- **Access:** Admin / HR
- **Response (200 OK):**
  ```json
  {
    "message": "All Departments fetched",
    "departments": [
      {
        "_id": "66f3e333bc45678901234571",
        "name": "Human Resources"
      }
    ]
  }
  ```

---

### 5.3 Update Department
- **Endpoint:** `PUT /api/department/:departmentId`
- **Access:** Admin / HR
- **Request Body:**
  ```json
  {
    "name": "Talent & Culture"
  }
  ```

---

### 5.4 Delete Department
- **Endpoint:** `DELETE /api/department/:departmentId`
- **Access:** Admin / HR
- **Response (200 OK):**
  ```json
  {
    "message": "Department Deleted Successfully"
  }
  ```
