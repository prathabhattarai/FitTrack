# Run Full Stack (Django + React)

## 1) Start MySQL service

- Ensure MySQL is running on localhost:3306.

## 2) Start Django backend

- Open PowerShell:
- Run: ./gym_django_backend/run_backend.ps1

Backend URL: http://localhost:8000

## 3) Start React frontend

- Open another PowerShell:
- Run: ./react_client_sample/run_frontend.ps1

Frontend URL: http://localhost:5174

## 4) Create admin user (first run only)

- In gym_django_backend folder:
- Run:
  - C:/Users/Pratha Bhattarai/AppData/Local/Programs/Python/Python313/python.exe manage.py createsuperuser

## 5) API test

- Login endpoint: POST http://localhost:8000/api/auth/login/
- Register endpoint: POST http://localhost:8000/api/auth/register/
